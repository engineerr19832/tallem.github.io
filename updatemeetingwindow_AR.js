function translateToArabic_up(updateWindow) {
    // Translations
    const fieldTranslations = {
        'Description': 'ملاحظات',
        'Start Time': 'وقت البدء',
        'End Time': 'وقت الانتهاء',
        'Repeat Every': 'كرر الاجتماع كل',
        'Repeat Frequency': 'يوم / شهر / سنة',
        'Number of Occurrences': 'عدد مرات التكرار',
        'Update Meetings': 'تحديث الاجتماعات'
    };

    const buttonTranslations = {
        'addAttendee': 'أضف مشارك',
        'deleteAttendee': 'احذف مشارك',
        'previous': 'سابق',
        'next': 'تالي',
        'updateMeeting': 'عدل المعلومات',
        'deleteMeeting': 'احذف الاجتماع'
    };

    // Translate buttons by ID
    Object.keys(buttonTranslations).forEach(function(id) {
        const button = updateWindow.document.getElementById(id);
        if (button) {
            button.textContent = buttonTranslations[id];
        }
    });

    // Translate labels based on their text content, but only affect labels
    Object.keys(fieldTranslations).forEach(function(text) {
        const labels = updateWindow.document.querySelectorAll('label');
        labels.forEach(function(label) {
            // Normalize the label's text for matching
            const normalizedLabelText = label.textContent.trim().replace(/[:\s]+$/, ''); // trim spaces and remove colons
            const normalizedKey = text.trim();

            // Log the original label text
            console.log(`Original label text: "${label.textContent}"`);

            if (normalizedLabelText === normalizedKey) {
                // Only update the label's text
                console.log(`Label translated: "${label.textContent}" -> "${fieldTranslations[text]}"`);
                label.textContent = fieldTranslations[text];
            }
        });
    });

    // Translate heading for "Update Meetings" (if applicable)
    const headings = updateWindow.document.querySelectorAll('h1, h2');
    headings.forEach(function(heading) {
        if (heading.textContent.includes('Update Meetings')) {
            console.log(`Heading translation: "${heading.textContent}" -> "${fieldTranslations['Update Meetings']}"`);
            heading.textContent = fieldTranslations['Update Meetings'];
        }
    });
}
