// Function to list files from Google Drive and check them against Firebase records
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
    tbody.innerHTML = ''; // Clear only table body, keeping the <thead> intact.

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
                ownerRow.innerHTML = `<td colspan="3" class="owner-cell" style="white-space: nowrap; width: auto; background-color: #ff8da1; text-align: left;">Owner: ${owner}</td>`;
                tbody.appendChild(ownerRow);

                // Add file rows for the owner
                ownerGroups[owner].forEach(file => {
                    const createdTime = new Date(file.createdTime).toLocaleString();
                    const row = document.createElement('tr');
                    row.className = 'file-row';
                    row.innerHTML = 
                        `<td>${file.name}</td>
                        <td id="status-${file.name}">${owner} - ${createdTime}</td>
                        <td>${createdTime}</td>`;
                    tbody.appendChild(row);
                });
            }

            // Add event delegation for table row selection after rendering
            addRowClickListener();

            // Check against Firebase records
            checkAgainstFirebase();
        })
        .catch(error => console.error('Error fetching files:', error));
    });
}

// Function to check cells against Firebase and log results
function checkAgainstFirebase() {
    const firestore = firebase.firestore();
    const rows = document.querySelectorAll('.second-table tbody .file-row');

    rows.forEach(row => {
        const statusCell = row.querySelector('td:nth-child(2)'); // Cell with "owner - create time"
        const statusText = statusCell.textContent.trim();
        const [ownerEmail, createdTime] = statusText.split(' - '); // Split into owner email and created time

        // Query the Firebase table
        firestore.collection('meetings_his_tbl')
            .where('owner', '==', ownerEmail)
            .where('createdTimestamp', '==', new Date(createdTime).toISOString()) // Match timestamps
            .get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    // Record found
                    statusCell.textContent = `${ownerEmail} - ${createdTime} - yes`;
                    console.log(`Match Found: Owner = ${ownerEmail}, Created Time = ${createdTime}`);
                } else {
                    // No matching record
                    statusCell.textContent = `${ownerEmail} - ${createdTime} - no`;
                    console.log(`No Match: Owner = ${ownerEmail}, Created Time = ${createdTime}`);
                }
            })
            .catch(error => console.error('Error querying Firebase:', error));
    });
}

// Function to add event delegation for row selection
function addRowClickListener() {
    const tbody = document.querySelector('.second-table tbody');
    if (!tbody) return; // Safety check in case tbody is still null

    tbody.addEventListener('click', (event) => {
        if (event.target && event.target.nodeName === 'TD') {
            const row = event.target.parentNode;

            // Prevent selecting the "Owner:" row
            if (row.classList.contains('owner-row')) {
                return; // Exit if it's an owner row
            }

            // Remove 'selected' class from other rows
            document.querySelectorAll('.second-table tbody tr').forEach(r => r.classList.remove('selected'));

            // Add 'selected' class to the clicked row
            row.classList.add('selected');
        }
    });
}

// Function to log specific owner and created time with Firestore rows
function logFirstOwnerAndTime() {
    const firstOwner = "engineerr1983@gmail.com";
    const firstCreatedTime = "11/8/2024, 9:43:59 PM";
    const firestore = firebase.firestore();

    firestore.collection('meetings_his_tbl').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const data = doc.data();
                console.log(`Log: ${firstOwner} - ${firstCreatedTime} with Firestore Entry: ${data.creatorEmail} - ${data.stopRecordingTime}`);
            });
        })
        .catch(error => console.error('Error reading Firestore:', error));
}

// Call listFiles when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    listFiles();
    logFirstOwnerAndTime();
});
