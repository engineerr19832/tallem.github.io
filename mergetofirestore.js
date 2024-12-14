function showCustomAlert() {
    document.getElementById('customAlert').style.display = 'block';
}

function hideCustomAlert() {
    document.getElementById('customAlert').style.display = 'none';
}

function mergeToFirestore() {
    showCustomAlert();
    const firestore = firebase.firestore(); // Ensure Firestore is initialized
    const table = document.querySelector('.second-table');
    const rows = table.getElementsByTagName('tr');
    const accessToken = localStorage.getItem('accessToken'); // Ensure correct access token is used for Google Drive

    const folderIds = [
        '13Z8vqg6TPeeP4nbvaI1nDUmY8tRfuF6a', // engineerr19832@gmail.com
        '1n7F6Dl6tGbw6lunDRDGYBNV-QThgJDer', // engineerr1983@gmail.com
        '1KpZz9gXTyoNONivjmjdhqpgWhh2WpX2O'  // translatingtobetter@gmail.com
    ];

    let selectedRowsExist = false;

    Array.from(rows).forEach((row, index) => {
        if (index === 0) return; // Skip header row

        if (row.classList.contains('selected')) {
            selectedRowsExist = true;
            const cells = row.getElementsByTagName('td');
            const fileName = cells[0].innerText.trim();

            // Find the owner row (first row with the same owner email)
            let ownerRow = row.previousElementSibling;
            let creatorEmail = null;

            while (ownerRow) {
                const ownerCell = ownerRow.querySelector('.owner-cell');
                if (ownerCell) {
                    creatorEmail = ownerCell.innerText.replace('Owner: ', '').trim();
                    break; // Once the owner email is found, exit the loop
                }
                ownerRow = ownerRow.previousElementSibling; // Move to the previous row
            }

            console.log(creatorEmail);

            if (!creatorEmail) {
                console.error("Owner email not found for selected row.");
                hideCustomAlert();
                alert("Failed to identify the owner email. Please check the table structure.");
                return;
            }

            const collectionRef = firestore.collection('meetings_his_tbl');

            // Fetch Google Drive metadata and process video
            uploadVideoToYouTube(accessToken, creatorEmail, fileName, folderIds)
                .then(({ youtubeVideoId, modifiedTime }) => {
                    if (!youtubeVideoId || !modifiedTime) {
                        hideCustomAlert();
                        alert('Failed to upload video or retrieve modified time.');
                        return;
                    }

                    const driveTimestamp = new Date(modifiedTime);

                    // Add Firestore record with Google Drive modifiedTime
                    collectionRef.add({
                        creatorEmail: creatorEmail,
                        stopRecordingTime: firebase.firestore.Timestamp.fromDate(driveTimestamp),
                        Notes: null,
                        videoURL: `https://www.youtube.com/watch?v=${youtubeVideoId}`
                    })
                    .then(() => {
                        hideCustomAlert();
                        alert(`Record for ${creatorEmail} added to Firestore / Yt channel with time ${driveTimestamp.toLocaleString()}`);
                    })
                    .catch(error => {
                        hideCustomAlert();
                        console.error('Error adding record to Firestore:', error);
                        alert('Error adding record to Firestore. See console for details.');
                    });
                })
                .catch(error => {
                    hideCustomAlert();
                    console.error('Error during video upload:', error);
                    alert('Error uploading video. See console for details.');
                });
        }
    });

    if (!selectedRowsExist) {
        alert("No records selected. Please select a record to merge to Firestore.");
    }
}

function uploadVideoToYouTube(accessToken, creatorEmail, fileName, folderIds) {
    const searchPromises = folderIds.map(folderId =>
        fetch(`https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${folderId}' in parents&fields=files(id, name, owners, modifiedTime)`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(response => response.json())
    );

    return Promise.all(searchPromises)
        .then(results => {
            const allFiles = results.flatMap(result => result.files || []);

            if (allFiles.length === 0) {
                hideCustomAlert();
                alert(`Video file not found in any of the specified folders: ${fileName}`);
                return null;
            }

            const fileFound = allFiles.find(file =>
                file.owners && file.owners.some(owner => owner.emailAddress === creatorEmail)
            );

            if (!fileFound) {
                hideCustomAlert();
                alert(`No matching file found for creatorEmail: ${creatorEmail}`);
                return null;
            }

            const driveFileId = fileFound.id;
            const modifiedTime = fileFound.modifiedTime; // Fetch Google Drive modifiedTime
            console.log("Drive File ID:", driveFileId, "Modified Time:", modifiedTime);

            const uploadUrl = `https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status`;

            const formattedTime = new Date(modifiedTime).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true, // Ensure 12-hour format (AM/PM)
                timeZone: 'Asia/Baghdad'
            });

            const metadata = {
                snippet: {
                    title: `${creatorEmail} - ${formattedTime}`,
                    description: `Video uploaded on behalf of ${creatorEmail}`,
                    publishedAt: new Date(modifiedTime).toISOString()
                },
                status: {
                    privacyStatus: "public"
                }
            };

            return fetch(`https://www.googleapis.com/drive/v3/files/${driveFileId}?alt=media`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            .then(response => response.blob())
            .then(fileBlob => {
                const formData = new FormData();
                formData.append('data', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
                formData.append('file', fileBlob);

                return fetch(uploadUrl, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${accessToken}` },
                    body: formData
                });
            })
            .then(youtubeResponse => youtubeResponse.json())
            .then(youtubeResponse => {
                if (youtubeResponse.id) {
                    console.log("YouTube Video ID:", youtubeResponse.id);
                    return { youtubeVideoId: youtubeResponse.id, modifiedTime };
                } else {
                    hideCustomAlert();
                    console.error('YouTube upload failed:', youtubeResponse);
                    alert('Failed to upload to YouTube. See console for details.');
                    return null;
                }
            });
        })
        .catch(error => {
            hideCustomAlert();
            console.error('Error during YouTube upload:', error);
            alert('YouTube upload encountered an error. Check console for details.');
            return null;
        });
}
