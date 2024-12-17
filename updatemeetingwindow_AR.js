function translateToArabic_up(updateWindow) {
    // Translations
    const fieldTranslations = {
        'Description': 'ملاحظات',
        'Start Time': 'وقت البدء',
        'End Time': 'وقت الانتهاء',
        'Rep. Every': 'كرر الاجتماع كل',
        'Freq': 'يوم / شهر / سنة',
        'Occur': 'عدد مرات التكرار',
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

    // Translate labels in <h1>, <h2>, and other text elements (e.g., description, start time, etc.)
    const textElements = updateWindow.document.querySelectorAll('h1, h2, p');
    textElements.forEach(function(element) {
        const normalizedText = element.textContent.trim().replace(/[:\s]+$/, ''); // trim spaces and remove colons
        
        Object.keys(fieldTranslations).forEach(function(key) {
            const normalizedKey = key.trim();
            if (normalizedText === normalizedKey) {
                element.textContent = fieldTranslations[key];
            }
        });
    });

    // Translate heading for "Update Meetings" (if applicable)
    const headings = updateWindow.document.querySelectorAll('h1, h2');
    headings.forEach(function(heading) {
        if (heading.textContent.includes('Update Meetings')) {
            heading.textContent = fieldTranslations['Update Meetings'];
        }
    });
}
