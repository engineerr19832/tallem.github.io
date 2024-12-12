function listFiles() {
    const accessToken = localStorage.getItem('accessToken');
    const folderIds = [
        '13Z8vqg6TPeeP4nbvaI1nDUmY8tRfuF6a', // engineerr19832@gmail.com
        '1n7F6Dl6tGbw6lunDRDGYBNV-QThgJDer', // engineerr1983@gmail.com
        '1KpZz9gXTyoNONivjmjdhqpgWhh2WpX2O'  // translatingtobetter@gmail.com
    ];

    const storage = firebase.storage();
    const firestore = firebase.firestore();
    const table = document.querySelector('.second-table');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = ''; // Clear table body, keeping the <thead> intact.

    folderIds.forEach(folderId => {
        fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(name, owners(displayName, emailAddress), createdTime)`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(response => response.json())
        .then(data => {
            const ownerGroups = {};

            data.files.forEach(file => {
                const ownerEmail = file.owners[0].emailAddress || 'N/A';
                if (!ownerGroups[ownerEmail]) {
                    ownerGroups[ownerEmail] = [];
                }
                ownerGroups[ownerEmail].push(file);
            });

            for (const owner in ownerGroups) {
                const ownerRow = document.createElement('tr');
                ownerRow.className = 'owner-row';
                ownerRow.innerHTML = `<td colspan="3" class="owner-cell" style="white-space: nowrap; width: auto; background-color: #ff8da1; text-align: left;">Owner: ${owner}</td>`;
                tbody.appendChild(ownerRow);

                ownerGroups[owner].forEach(file => {
                    const createdTime = new Date(file.createdTime).toLocaleString();
                    const row = document.createElement('tr');
                    row.className = 'file-row';
                    row.innerHTML = `
                        <td>${file.name}</td>
                        <td id="status-${file.name}">Checking...</td>
                        <td>${createdTime}</td>
                    `;
                    tbody.appendChild(row);

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

            addRowClickListener();
        })
        .catch(error => console.error('Error fetching files:', error));
    });
}
