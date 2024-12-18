function loadArabicContent(newWindow, events) {
    // Select the buttons to keep
    const recordButton = newWindow.document.getElementById('recordmeet');
    const stopButton = newWindow.document.getElementById('stoprecord');
    const backButton2 = newWindow.document.getElementById('backButton');

     // Create a temporary container for the buttons
    const buttonContainer = document.createDocumentFragment();
    if (recordButton) buttonContainer.appendChild(recordButton);
    if (stopButton) buttonContainer.appendChild(stopButton);
    if (backButton2) buttonContainer.appendChild(backButton2);

    // Clear the content of the body while keeping the buttons
    const bodyContent = newWindow.document.body.innerHTML;

    // Clear the entire body
    newWindow.document.body.innerHTML = '';

    // Re-add the buttons from the temporary container
    newWindow.document.body.appendChild(buttonContainer);

    // Set the title and create the heading in Arabic
    newWindow.document.title = 'غرفة الاجتماعات';
    const heading = newWindow.document.createElement('h2');
    heading.textContent = 'غرفة الاجتماعات';
    heading.style.fontSize = '16px'; // Minimized font size for heading
    newWindow.document.body.appendChild(heading);

    // Create a list for events
    const eventList = newWindow.document.createElement('ul');
    newWindow.document.body.appendChild(eventList);

    events.forEach(event => {
        const startTime = new Date(event.start.dateTime).toLocaleString();
        const endTime = new Date(event.end.dateTime).toLocaleString();
        const creatorEmail = event.creator.email;
        const description = event.description || 'لا يوجد ملاحظات';
        const hangoutLink = event.hangoutLink || 'لا يوجد رابط';

        // Keep recurrenceInfo in English
        let recurrenceInfo = 'Single Meeting'; // Default to English
        if (event.recurrence) {
            recurrenceInfo = 'Recurring Meeting'; // Default to English

            const recurrenceRule = event.recurrence[0];
            const countMatch = recurrenceRule.match(/COUNT=(\d+)/);
            if (countMatch) {
                recurrenceInfo += `, occurs ${countMatch[1]} times`; // Keep in English
            }

            const freqMatch = recurrenceRule.match(/FREQ=(\w+)/);
            if (freqMatch) {
                recurrenceInfo += `, frequency: ${freqMatch[1].toLowerCase()}`; // Keep in English
            }
        }

        const listItem = newWindow.document.createElement('li');
        listItem.innerHTML = `
            <strong>وقت البدء:</strong> ${startTime}<br>
            <strong>وقت الانتهاء:</strong> ${endTime}<br>
            <strong>ايميل مدير الاجتماع:</strong> ${creatorEmail}<br>
            <strong>ملاحظات:</strong> ${description}<br>
            <strong>رابط الاجتماع:</strong> <a href="${hangoutLink}" class="meeting-link" data-creator-email="${creatorEmail}" target="_blank">${hangoutLink}</a><br>
            <strong>نوع الاجتماع:</strong> ${recurrenceInfo} <!-- Remain in English -->
        `;
        listItem.style.fontSize = '12px'; // Minimized font size for event list items
        eventList.appendChild(listItem);
    });

    // Translate existing button text to Arabic and minimize button text size
    if (recordButton) {
        recordButton.textContent = 'بدء التسجيل'; // Translate to Arabic
        recordButton.style.fontSize = '16px'; // Minimized font size for button
    }
    
    if (stopButton) {
        stopButton.textContent = 'انهاء التسجيل'; // Translate to Arabic
        stopButton.style.fontSize = '16px'; // Minimized font size for button
    }
     if (backButton2) {
        backButton2.textContent = 'عودة'; // Translate to Arabic
        backButton2.style.fontSize = '16px'; // Minimized font size for button
    }
}
