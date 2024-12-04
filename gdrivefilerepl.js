// Function to populate table and check existence in Firestore
function listFiles() {
    const accessToken = localStorage.getItem('accessToken');
    const folderIds = [
        '13Z8vqg6TPeeP4nbvaI1nDUmY8tRfuF6a', // engineerr19832@gmail.com
        '1n7F6Dl6tGbw6lunDRDGYBNV-QThgJDer', // engineerr1983@gmail.com
        '1KpZz9gXTyoNONivjmjdhqpgWhh2WpX2O'  // translatingtobetter@gmail.com
    ];
    const firestore = firebase.firestore();
    const table = document.getElementById('fileTable');
    table.innerHTML = ''; // Clear existing rows

    // Loop through each folder ID and fetch its contents
    folderIds.forEach(folderId => {
        fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(name, owners(displayName, emailAddress), createdTime)`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(response => response.json())
        .then(data => {
            // Group files by owner
            const ownerGroups = {};
            data.files.forEach(file => {
                const ownerEmail = file.owners[0].emailAddress || 'N/A';
                if (!ownerGroups[ownerEmail]) {
                    ownerGroups[ownerEmail] = [];
                }
                ownerGroups[ownerEmail].push(file);
            });

            // Render each group
            for (const owner in ownerGroups) {
                // Add the owner row
                const ownerRow = document.createElement('tr');
                ownerRow.className = 'owner-row';
                ownerRow.innerHTML = `<td colspan="3">Owner: ${owner}</td>`;
                table.appendChild(ownerRow);

                // Add file rows for the owner
                ownerGroups[owner].forEach(file => {
                    const createdTime = new Date(file.createdTime).toLocaleString();
                    const row = document.createElement('tr');
                    row.className = 'file-row';
                    row.innerHTML = `
                        <td>${file.name}</td>
                        <td id="status-${file.name}">Checking...</td>
                        <td>${createdTime}</td>
                    `;
                    table.appendChild(row);

                    // Check Firestore for existence
                    const createdTimestamp = firebase.firestore.Timestamp.fromDate(new Date(file.createdTime));
                    firestore.collection('meetings_his_tbl')
                        .where('creatorEmail', '==', owner)
                        .where('stopRecordingTime', '==', createdTimestamp)
                        .get()
                        .then(querySnapshot => {
                            const statusCell = document.getElementById(`status-${file.name}`);
                            if (!querySnapshot.empty) {
                                statusCell.textContent = 'Exists in Firestore';
                            } else {
                                statusCell.textContent = 'Not in Firestore';
                            }
                        })
                        .catch(error => console.error('Error checking Firestore:', error));
                });
            }
        })
        .catch(error => console.error('Error fetching files:', error));
    });
}

document.addEventListener('DOMContentLoaded', listFiles);
