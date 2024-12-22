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
    
    document.getElementById('updatenotes').textContent = 'عدل الملاحظة';
    document.getElementById('updatenotes').style.fontSize = '0.8em';

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
        if (translatedText) {
            label.textContent = ''; // Clear existing content
            const h3 = document.createElement('h3'); // Create an <h3> element
            h3.textContent = translatedText;
            h3.style.margin = '0'; // Add styling to mimic original layout
            label.style.display = 'block'; // Ensure the label takes up its own line
            label.appendChild(h3); // Append the <h3> to the label
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
