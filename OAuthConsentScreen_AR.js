document.addEventListener("DOMContentLoaded", function() {
    // Check if the localStorage variable `arpage` is set to 'ar'
    if (localStorage.getItem("arpage") === "ar") {
        // Translate elements to Arabic based on their current inner text

        // Translate the header text with "OAuth Consent Workflow Authentication"
        const h3Elements = document.querySelectorAll("h3");
        h3Elements.forEach((el) => {
            if (el.innerText.includes("OAuth Consent Workflow Authentication")) {
                el.innerHTML = "السماح بالدخول باستخدام حساب الغوغل";
                el.style.textAlign = "center";
                el.style.position = "relative";
                el.style.right = "-90px";
            }
        });

        // Translate text containing "Remember: Sign in to Google services with the same email that's used in login screen..."
        const h4Elements = document.querySelectorAll("h4");
        h4Elements.forEach((el) => {
            if (el.innerText.includes("Remember: Sign in to Google services with the same email")) {
                el.innerHTML = "تذكر: سجل الدخول باستخدام حساب غوغل";
            } else if (el.innerText.includes("used in login screen...")) {
                el.innerHTML = "الذي استخدمته في شاشة الدخول الرئيسية";
            } else if (el.innerText.includes("Otherwise click (Sign out) to return")) {
                el.innerHTML = "أو اضغط على زر خروج للعودة للشاشة الرئيسية";
            } else if (el.innerText.includes("to login screen...")) {
                el.innerHTML = ""; // Remove this line if no translation is needed for this line
            }
        });

        // Translate the OAuth Button text
        const oauthButton = document.querySelector("#oauthButton h5");
        if (oauthButton && oauthButton.innerText.includes("Click to Grant OAuth Consent To Google services")) {
            oauthButton.innerHTML = "أضغط لتسجيل الدخول بحساب غوغل";
        }

        // Translate the Sign Out Button text
        const signOutButton = document.querySelector("#signout h5");
        if (signOutButton && signOutButton.innerText.includes("Sign out")) {
            signOutButton.innerHTML = "خروج";
        }
    }
});
