// Inject the CSS dynamically into the page
const style = document.createElement('style');
style.innerHTML = `
    .owner-cell {
        white-space: nowrap;
        width: auto;
        background-color: #ff8da1; /* Set background color */
    }
    .owner-cell td {
        text-align: left; /* Ensure text inside td is aligned to the left */
    }
`;
document.head.appendChild(style);

// Function to populate table and check existence in Firestore
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
    tbody.innerHTML = ''; // Clear only table body, keeping the <thead> intact

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
                ownerRow.innerHTML = `<td colspan="3" class="owner-cell">Owner: ${owner}</td>`;
                tbody.appendChild(ownerRow);

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
                    tbody.appendChild(row);

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

            // Add event delegation for table row selection after rendering
            addRowClickListener();
        })
        .catch(error => console.error('Error fetching files:', error));
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
