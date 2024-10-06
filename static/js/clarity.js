if (typeof window.clarity === 'undefined' || !window.clarity.v) {
    window.clarity = function () {
        (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    window.clarity.v = true; // Mark that Clarity has been initialized

    // Invoke the consent function to apply any necessary privacy settings
    window.clarity('consent');

    // Initialize Clarity with project ID only if it's not already set up
    (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () {
            (c[a].q = c[a].q || []).push(arguments);
        };
        t = l.createElement(r);
        t.async = 1;
        t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "o4jjk03uom");
} else {
    console.log("Clarity is already initialized.");
}

// window.clarity = function (consent) {
//
// };
// window.clarity('consent');
//
//
// (function (c, l, a, r, i, t, y) {
//     c[a] = c[a] || function () {
//         (c[a].q = c[a].q || []).push(arguments)
//     };
//     t = l.createElement(r);
//     t.async = 1;
//     t.src = "https://www.clarity.ms/tag/" + i;
//     y = l.getElementsByTagName(r)[0];
//     y.parentNode.insertBefore(t, y);
// })(window, document, "clarity", "script", "o4jjk03uom");
