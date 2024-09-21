function addGoogleAnalytics() {
    // Create script element for gtag.js
    const gtagScript = document.createElement('script');
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-G3NN486JFL';
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    // Initialize the Google Analytics configuration
    gtagScript.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-G3NN486JFL');
    };
}

// Call the function to add Google Analytics
addGoogleAnalytics();
