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
                console.log(file.modifiedTime);
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
                    //const createdTime = new Date(file.createdTime).toLocaleString();
                    const firestoreTimestamp = firebase.firestore.Timestamp.fromDate(new Date(file.createdTime));
                    const createdTime = firestoreTimestamp.toDate().toLocaleString();
                  //  const createdTime = new Date(file.createdTime).toLocaleString('en-US', { timeZone: 'UTC' }); // Display in UTC

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

// Function to check cells against Firebase
function checkAgainstFirebase() {
    const firestore = firebase.firestore();
    const rows = document.querySelectorAll('.second-table tbody .file-row');

    rows.forEach(row => {
        const statusCell = row.querySelector('td:nth-child(2)'); // Cell with "owner - create time"
        const statusText = statusCell.textContent.trim();
        const [ownerEmail, createdTime] = statusText.split(' - '); // Split into owner email and created time

         // Convert createdTime to Firestore Timestamp
        const firestoreTimestamp = firebase.firestore.Timestamp.fromDate(new Date(createdTime));
        
        // Query the Firebase table, matching both owner and stopRecordingTime
        firestore.collection('meetings_his_tbl')
            .where('creatorEmail', '==', ownerEmail)
           // .where('stopRecordingTime', '==', new Date(createdTime).toISOString()) // Match timestamps
              .where('stopRecordingTime', '==', firestoreTimestamp) // Use Firestore Timestamp for comparison
            .get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    // Record found
                    statusCell.textContent = `${ownerEmail} - ${createdTime} - yes`;
                } else {
                    // No matching record
                    statusCell.textContent = `Not in Firestore`;
                }
                 // Filter out rows with "yes" status
                if (statusCell.textContent.includes('yes')) {
                    row.style.display = 'none'; // Hide the row
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

// Call listFiles when the DOM is ready
document.addEventListener('DOMContentLoaded', listFiles);
