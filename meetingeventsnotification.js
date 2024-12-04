function meetingeventnotification() {
    console.log("meetingeventnotification function called");
    const accessToken = localStorage.getItem('accessToken');
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    console.log("Access Token:", accessToken);
    console.log("Logged In Email:", loggedInEmail);

    if (accessToken && loggedInEmail) {
        loadMeetings();
    } else {
        alert('Please log in to load invitations.');
    }
}

function loadMeetings() {
    const accessToken = localStorage.getItem('accessToken');

    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        const loggedInEmail = localStorage.getItem('loggedInEmail');
        const filteredEvents = data.items.filter(event =>
            event.attendees && event.attendees.some(attendee => attendee.email === loggedInEmail)
        );

        // Check each event and schedule notifications
        filteredEvents.forEach(event => {
            const eventStart = new Date(event.start.dateTime);

            const checkNotificationTiming = setInterval(() => {
                const now = new Date();
                const timeBeforeStart = (eventStart - now) / 1000 / 60; // Convert to minutes

                // Check various conditions for notification timing
                 if (timeBeforeStart <= 15 && timeBeforeStart >= -5) {
                  // Add your action here, for example, showNotification(event) if needed
                    showNotification(event); // Or handle it as needed
                 }
                  else if (timeBeforeStart > 0 && Math.floor(timeBeforeStart) === 15) {
                    showNotification(event);
                } else if (timeBeforeStart > 0 && Math.floor(timeBeforeStart) === 13) {
                    showNotification(event);
                } else if (timeBeforeStart > 0 && Math.floor(timeBeforeStart) === 11) {
                    showNotification(event);
                } else if (timeBeforeStart > 0 && Math.floor(timeBeforeStart) === 9) {
                    showNotification(event);
                } else if (timeBeforeStart < 0 && Math.floor(timeBeforeStart) === 7) {
                    showNotification(event);
                } else if (timeBeforeStart < 0 && Math.floor(timeBeforeStart) === 5) {
                    showNotification(event);
                }
                 else if (timeBeforeStart < 0 && Math.floor(timeBeforeStart) === 3) {
                    showNotification(event);
                }
                else if (timeBeforeStart < 0 && Math.floor(timeBeforeStart) === 1) {
                    showNotification(event);
                }
                 else if (timeBeforeStart < 0 && Math.ceil(timeBeforeStart) === -1) {
                    showNotification(event);
                }
                 else if (timeBeforeStart < 0 && Math.ceil(timeBeforeStart) === -3) {
                    showNotification(event);
                }
                 else if (timeBeforeStart < 0 && Math.ceil(timeBeforeStart) === -5) {
                    showNotification(event);
                    clearInterval(checkNotificationTiming); // Stop the loop after the last notification
                }
            }, 60000); // Check every minute
        });
    })
    .catch(error => console.error("Error loading meetings:", error));
}

function showNotification(event) {
    console.log('showNotification called');

    const startTime = new Date(event.start.dateTime).toLocaleString();
    const endTime = new Date(event.end.dateTime).toLocaleString();
    const creatorEmail = event.creator.email;
    const description = event.description || 'No description';
    const hangoutLink = event.hangoutLink || 'No link available';

    // Variables for field labels
    let startTime_var, endTime_var, creatorEmail_var, description_var, hangoutLink_var;

    // Check if the page is in Arabic
    if (localStorage.getItem('arpage') === 'ar') {
        startTime_var = 'وقت البدء';
        endTime_var = 'وقت الانتهاء';
        creatorEmail_var = 'ايميل مدير الاجتماع';
        description_var = 'ملاحظات';
        hangoutLink_var = 'رابط الاجتماع';
    } else {
        startTime_var = 'Start Time';
        endTime_var = 'End Time';
        creatorEmail_var = "Creator's Email";
        description_var = 'Description';
        hangoutLink_var = 'Meeting Link';
    }

    const notificationContainer = document.createElement('div');
    notificationContainer.classList.add('notification');
    notificationContainer.style.cssText = `
        position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    width: 350px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    color: black;
    display: block;
    text-align: center;
    `;

    document.querySelectorAll('.notification').forEach((n, i) => {
        n.style.bottom = `${(i + 1) * 110}px`;
    });

    notificationContainer.innerHTML = `
        <div style="position: relative; padding-right: 20px;">
            <strong>${startTime_var}:</strong> ${startTime}<br>
            <strong>${endTime_var}:</strong> ${endTime}<br>
            <strong>${creatorEmail_var}:</strong> ${creatorEmail}<br>
            <strong>${description_var}:</strong> ${description}<br>
            <strong>${hangoutLink_var}:</strong> <a href="#" class="meeting-link" data-hangout-link="${hangoutLink}" data-creator-email="${creatorEmail}">${hangoutLink}</a><br>
        </div>
        <button style="position: absolute; top: 5px; right: 5px; border: none; background: transparent; cursor: pointer;">&times;</button>
    `;

    document.body.appendChild(notificationContainer);
    console.log('Notification added to the DOM');

    const closeButton = notificationContainer.querySelector('button');
    closeButton.addEventListener('click', () => {
        notificationContainer.remove();
        repositionNotifications();
    });

    // Add click event to meeting link
    const meetingLink = notificationContainer.querySelector('.meeting-link');
    meetingLink.addEventListener('click', function (e) {
        e.preventDefault();
        const hangoutLink = this.getAttribute('data-hangout-link');
        openRecordingWindow(hangoutLink); // Open the recording controls window
        window.open(hangoutLink, '_blank'); // Open the meeting link in a new tab
    });
}

function repositionNotifications() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach((n, i) => {
        n.style.bottom = `${i * 110}px`;
    });
}

function openRecordingWindow(hangoutLink) {
    const width = 420;
    const height = 140;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    const newWindow = window.open('', '_blank', `
        width=${width},
        height=${height},
        top=${top},
        left=${left},
        resizable=no,
        scrollbars=no,
        toolbar=no,
        menubar=no,
        status=no,
        alwaysRaised=yes
    `);

    newWindow.document.write(`
        <html>
        <head><title>Recording Controls</title></head>
        <body>
            <h2>Recording Controls</h2>
            <button id="startRecording">Start Recording</button>
            <button id="stopRecording" disabled>Stop Recording</button>
        </body>
        </html>
    `);

    const startButton = newWindow.document.getElementById('startRecording');
    const stopButton = newWindow.document.getElementById('stopRecording');
    let mediaRecorder;
    let stream;

    startButton.addEventListener('click', () => {
        const creatorEmail = localStorage.getItem('creatorEmail');
        const loggedInEmail = localStorage.getItem('loggedInEmail');

        if (creatorEmail === loggedInEmail) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((mediaStream) => {
                    stream = mediaStream;
                    mediaRecorder = new MediaRecorder(stream);
                    const chunks = [];

                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                            chunks.push(event.data);
                        }
                    };

                    mediaRecorder.onstop = async () => {
                        const blob = new Blob(chunks, { type: 'video/webm' });
                        const storageRef = firebase.storage().ref();
                        const videoRef = storageRef.child(`meetings_videos/${new Date().getTime()}_meeting_recording.webm`);
                        const db = firebase.firestore();

                        try {
                            const snapshot = await videoRef.put(blob);
                            const downloadURL = await snapshot.ref.getDownloadURL();

                            await db.collection('meetings_his_tbl').add({
                                creatorEmail: loggedInEmail,
                                stopRecordingTime: firebase.firestore.FieldValue.serverTimestamp(),
                                videoURL: downloadURL,
                                Notes: null
                            });

                            newWindow.alert("Recording saved in Firestore DB ");
                        } catch (error) {
                            console.error("Error saving recording: ", error);
                        }
                    };

                    mediaRecorder.start();
                    startButton.disabled = true;
                    stopButton.disabled = false;
                    newWindow.alert("Recording started");

                })
                .catch((error) => {
                    console.error("Error accessing media devices: ", error);
                });
        } else {
            newWindow.alert("You are not authorized to start recording.");
        }
    });

    stopButton.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());
            startButton.disabled = false;
            stopButton.disabled = true;
            newWindow.alert("Recording stopped");
        }
    });

    // Disable close button and minimize/maximize ability
    newWindow.onbeforeunload = function () {
        return "This window cannot be closed.";
    };

    // Focus and make sure the window stays on top
    newWindow.focus();
    const intervalId = setInterval(() => {
        newWindow.focus();
    }, 1000);

    // Clear the interval when the window is closed
    newWindow.addEventListener('beforeunload', () => {
        clearInterval(intervalId);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    meetingeventnotification();
});
