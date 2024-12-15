function updateNotes() {
    const selectedRow = document.querySelector('.selected');

    if (!selectedRow) {
        alert('Please select a row to update the notes.');
        return;
    }

    // Get the Notes field (textarea) and lecturer email
    const notesTextarea = selectedRow.querySelector('textarea');
    const newNotes = notesTextarea ? notesTextarea.value.trim() : '';
    let selectedLecturerEmail = selectedRow.cells[0].textContent.trim(); // First cell is lecturer email

    // If the current row's lecturer email is null, traverse to find it
    if (!selectedLecturerEmail) {
        let currentRow = selectedRow.previousElementSibling;

        while (currentRow) {
            const ownerEmail = currentRow.cells[0]?.textContent.trim();

            if (ownerEmail) {
                selectedLecturerEmail = ownerEmail;
                break;
            }

            currentRow = currentRow.previousElementSibling;
        }
    }

    const loggedInEmail = localStorage.getItem('loggedInEmail');

    // Authorization check: if logged-in user is not the creator
    if (loggedInEmail !== selectedLecturerEmail) {
        alert('Only the meeting creator is authorized to update the notes field for this meeting video.');
        return;
    }

    // Check if the new notes field is empty
    if (!newNotes) {
        alert('Please enter a value for the Notes field.');
        return;
    }

    // Fetch the original Notes field from Firestore
    const db = firebase.firestore();
    const docId = selectedRow.getAttribute('data-document-id'); // Ensure this is not empty or null
    console.log("Selected row's document ID:", docId);

    if (!docId) {
        console.error('No document ID found for the selected row.');
        return;
    }

    const docRef = db.collection('meetings_his_tbl').doc(docId);

    docRef.get().then(doc => {
        if (doc.exists) {
            const originalNotes = doc.data().Notes || '';

            // Check if the new notes are the same as the original notes
            if (originalNotes === newNotes) {
                alert('The new value already exists in the table.');
                return;
            }

            // Update the Notes field in Firestore
            docRef.update({ Notes: newNotes })
                .then(() => {
                    alert('Notes updated successfully.');
                    console.log('Notes updated successfully.');
                })
                .catch(error => {
                    console.error('Error updating notes:', error);
                });
        } else {
            console.error('Document does not exist.');
        }
    }).catch(error => {
        console.error('Error fetching document:', error);
    });
}
