document.addEventListener("DOMContentLoaded", function() {
    // Check if the localStorage variable `arpage` is set to 'ar'
    if (localStorage.getItem("arpage") === "ar") {
        // Translate the button texts into Arabic
        const buttons = document.querySelectorAll('.tablink');
        
        if (buttons.length >= 7) {
            buttons[0].innerHTML = "غرفة الاجتماعات";
            buttons[1].innerHTML = "مقاطع";
            buttons[2].innerHTML = "منشورات";
            buttons[3].innerHTML = "سير ذاتية";
            buttons[4].innerHTML = "محتوى";
            buttons[5].innerHTML = "مدير";
            buttons[6].innerHTML = "خروج";
            
            // Make the text bold for each button
            buttons.forEach(button => {
                button.style.fontWeight = "bold";
            });
        }
    }
});
