function translatePageToArabic() {
    // Translate table headers
    document.querySelector('th:nth-child(1)').textContent = 'ايميل الاستاذ';

    // Translate buttons
    document.getElementById('deleteVideo').textContent = 'حذف المحتوى';
    document.getElementById('deleteVideo').style.fontSize = '0.8em';
    document.getElementById('deleteVideo').style.paddingBottom = '3px';
    document.getElementById('deleteVideo').style.fontWeight = 'bold';
    
    document.getElementById('fileupload').textContent = 'تحميل المحتوى';
    document.getElementById('fileupload').style.fontSize = '0.8em';
    document.getElementById('fileupload').style.paddingBottom = '3px';
    document.getElementById('fileupload').style.fontWeight = 'bold';
    
    document.getElementById('updatenotes').textContent = 'عدل الملاحظة';
    document.getElementById('updatenotes').style.fontSize = '0.8em';
    document.getElementById('updatenotes').style.fontWeight = 'bold';

    console.log(document.getElementById('deleteVideo')); // Should log the button element or `null`
console.log(document.getElementById('fileupload'));
console.log(document.getElementById('updatenotes'));


    // Translate combo box labels based on their text
    const labels = document.querySelectorAll('label');
    let translatedText = null;
    
    labels.forEach(label => {
        if (label.textContent.trim() === 'Lecturer Email') {
            label.textContent = 'ايميل الاستاذ';
            label.style.fontWeight = 'bold'; // Make the text bold
             label.style.display = 'block';
        } else if (label.textContent.trim() === 'Lecture Time') {
            label.textContent = 'تاريخ المحاضرة';
            label.style.fontWeight = 'bold'; // Make the text bold
             label.style.display = 'block';
        }
    });


document.addEventListener('DOMContentLoaded', function () {
    const lecturesTable = document.getElementById('lectures-table');
    console.log("Table is: ", lecturesTable);

    if (lecturesTable) {
        const tbody = lecturesTable.querySelector('tbody');

        if (tbody) {
            // Observe changes in the table's body
            const observer = new MutationObserver(() => {
                console.log("Table rows changed. Running translation...");
                translateTableCells(lecturesTable);
            });

            observer.observe(tbody, {
                childList: true, // Watch for added/removed rows
            });

            // Run translation function initially in case rows already exist
            translateTableCells(lecturesTable);
        } else {
            console.error("The table does not have a <tbody> element.");
        }
    } else {
        console.error("The table with ID 'lectures-table' was not found.");
    }
});

function translateTableCells(lecturesTable) {
    const tableCells = lecturesTable.querySelectorAll('td');
    console.log("Table cells found:", tableCells);

    if (tableCells.length === 0) {
        console.warn("No table cells found for translation.");
        return;
    }

    tableCells.forEach(cell => {
        const cellText = cell.textContent.trim();

        if (cellText === 'Display content') {
            cell.textContent = 'اعرض المحتوى';
        } else if (cellText === 'Display Lecture') {
            cell.textContent = 'اعرض المحاضرة';
            console.log("Translated 'Display Lecture' to Arabic.");
        } else if (cellText === 'Display picture') {
            cell.textContent = 'اعرض الصورة';
        }
    });
}

    
}
