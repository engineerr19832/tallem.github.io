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


const tableCells = document.querySelectorAll('table td'); // Select all table cells
tableCells.forEach(cell => {
    const link = cell.querySelector('a'); // Check if the cell contains a link
    if (link) {
        const linkText = link.textContent.trim();
        console.log("Link Text Found:", linkText);
        // Translate the link text without altering the href
        if (linkText === 'Display Content') {
            link.textContent = 'اعرض المحتوى';
        } else if (linkText === 'Display Lecture') {
            link.textContent = 'اعرض المحاضرة';
        } else if (linkText === 'Display Picture') {
            link.textContent = 'اعرض الصورة';
        }
    }
});
    
}
