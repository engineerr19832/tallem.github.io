// Function to translate table headers, specific cell content, and table rows to Arabic
function translateTableToArabic() {
    // Translate the table headers
    const headers = document.querySelectorAll('th');
    if (headers[0]) {
        headers[0].textContent = 'ايميل المستخدم'; // 'User email'
    }
    
    // Translate the table content based on cell values
    const rows = document.querySelectorAll('#tableBody tr');
    rows.forEach(row => {
        // Look for cells containing specific values and translate them
        const cells = row.children;

        Array.from(cells).forEach(cell => {
            const cellText = cell.textContent.trim();

            // Translate Category (lecturer/student)
            if (cellText === 'lecturer') {
                cell.textContent = 'محاضر';
                cell.style.fontWeight = 'bold';
                console.log("Category translated to محاضر");
            } else if (cellText === 'student') {
                cell.textContent = 'طالب';
                cell.style.fontWeight = 'bold';
                console.log("Category translated to طالب");
            }

            // Translate Logged in Status (Online/Offline)
            if (cellText === 'Online') {
                cell.textContent = 'متصل';
                cell.style.fontWeight = 'bold';
                console.log("Status translated to متصل");
            } else if (cellText === 'Offline') {
                cell.textContent = 'غير متصل';
                cell.style.fontWeight = 'bold';
                console.log("Status translated to غير متصل");
            }
        });
    });
}
