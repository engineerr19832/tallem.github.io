function translatePageToArabic() {
    // Translate table headers
    document.querySelector('th:nth-child(1)').textContent = 'ايميل الاستاذ';

    // Translate buttons
    document.getElementById('deleteVideo').textContent = 'حذف المحتوى';
    document.getElementById('deleteVideo').style.fontWeight = 'bold';
    document.getElementById('deleteVideo').style.fontSize = '0.8em';
    
    document.getElementById('fileupload').textContent = 'تحميل المحتوى';
    document.getElementById('fileupload').style.fontWeight = 'bold';
    document.getElementById('fileupload').style.fontSize = '0.8em';
    
    document.getElementById('updatenotes').textContent = 'تعديل الملاحظات';
    document.getElementById('updatenotes').style.fontWeight = 'bold';
    document.getElementById('updatenotes').style.fontSize = '0.8em';

    console.log(document.getElementById('deleteVideo')); // Should log the button element or `null`
console.log(document.getElementById('fileupload'));
console.log(document.getElementById('updatenotes'));


    // Translate combo box labels based on their text
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        if (label.textContent.trim() === 'Lecturer Email') {
            label.textContent = 'ايميل الاستاذ';
        } else if (label.textContent.trim() === 'Lecture Time') {
            label.textContent = 'تاريخ المحاضرة';
        }
    });

    // Translate "Display the lecture" cells
    const cells = document.querySelectorAll('td:nth-child(3) a');
    cells.forEach(cell => {
        const originalText = cell.textContent.trim();
        const cellHref = cell.href;
        const extension = getFileExtension(cellHref).toLowerCase();
        let translatedText = 'اعرض المحتوى'; // Default text

        // Check for specific keywords and translate accordingly
        if (originalText === 'Display the lecture') {
            translatedText = 'اعرض المحاضرة';
        } else if (['png', 'jpg', 'jpeg'].includes(extension)) {
            translatedText = 'اعرض الصورة';
        } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(extension)) {
            translatedText = `${extension.toUpperCase()} / اعرض المحتوى`;
        }

        // Set the translated text
        cell.textContent = translatedText;
    });
}

// Helper function to get file extension
function getFileExtension(url) {
    return url.split('.').pop().split(/\#|\?/)[0];
}
