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

   // Translate "Display the lecture" cells
const links = document.querySelectorAll('table a'); // Find all <a> elements in the table
links.forEach(link => {
    const originalText = link.textContent.trim();
    const linkHref = link.href;
    const extension = getFileExtension(linkHref).toLowerCase();
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
    link.textContent = translatedText;
});

// Helper function to get file extension
function getFileExtension(url) {
    return url.split('.').pop().split(/\#|\?/)[0];
}
              }
