function showCustomAlert() {
    document.getElementById('customAlert').style.display = 'block';
}

function hideCustomAlert() {
    document.getElementById('customAlert').style.display = 'none';
}

function mergeToFirestore() {
    showCustomAlert();
    const firestore = firebase.firestore(); // Ensure Firestore is initialized
    const storage = firebase.storage(); // Ensure Firebase Storage is initialized
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
            uploadVideoToFirebase(accessToken, creatorEmail, fileName, folderIds, storage)
                .then(({ videoUrl, modifiedTime }) => {
                    if (!videoUrl || !modifiedTime) {
                        hideCustomAlert();
                        alert('Failed to upload video or retrieve modified time.');
                        return;
                    }

                    const driveTimestamp = new Date(modifiedTime);

                    // Convert to UTC by manually setting the time in UTC format if necessary
                    const utcTimestamp = new Date(driveTimestamp.getUTCFullYear(), 
                               driveTimestamp.getUTCMonth(), 
                               driveTimestamp.getUTCDate(), 
                               driveTimestamp.getUTCHours(), 
                               driveTimestamp.getUTCMinutes(), 
                               driveTimestamp.getUTCSeconds());

                    // Directly add a new record without checking for existing ones
                    collectionRef.add({
                        creatorEmail: creatorEmail,
                        stopRecordingTime: firebase.firestore.Timestamp.fromDate(driveTimestamp),
                        Notes: null,
                        videoURL: videoUrl, // Add videoUrl here
                        fileName: fileName // Add fileName here
                    })
                    .then(() => {
                        hideCustomAlert();
                        alert(`Record for ${creatorEmail} added to Firestore with time ${driveTimestamp.toLocaleString()}`);
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

function uploadVideoToFirebase(accessToken, creatorEmail, fileName, folderIds, storage) {
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

            return fetch(`https://www.googleapis.com/drive/v3/files/${driveFileId}?alt=media`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            .then(response => response.blob())
            .then(fileBlob => {
                const storageRef = storage.ref(`meetings_videos/${fileName}`);
                return storageRef.put(fileBlob)
                    .then(snapshot => snapshot.ref.getDownloadURL())
                    .then(downloadURL => {
                        console.log("Firebase Storage Video URL:", downloadURL);
                        return { videoUrl: downloadURL, modifiedTime };
                    });
            });
        })
        .catch(error => {
            hideCustomAlert();
            console.error('Error during Firebase Storage upload:', error);
            alert('Firebase Storage upload encountered an error. Check console for details.');
            return null;
        });
}
