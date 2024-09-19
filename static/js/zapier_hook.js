let ipAddress = '';

        // Fetch the IP address once when the page loads
        async function fetchIpAddress() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                ipAddress = data.ip;
            } catch (error) {
                console.error('Failed to fetch IP address:', error);
            }
        }

        // Fetch IP address on page load
        fetchIpAddress().then(r => console.log(r));

        // Function to send data to Zapier when the user is leaving the page
        function sendVisitorData() {
            // Prepare data to be sent
            const data = {
                ip: ipAddress || 'IP not available',  // Ensure IP is included or provide fallback
                browser: navigator.userAgent,
                os: navigator.userAgentData ? navigator.userAgentData.platform : navigator.platform,
                time: new Date().toLocaleString()
            };

            // Send data to Zapier using sendBeacon for reliability
            navigator.sendBeacon('https://hooks.zapier.com/hooks/catch/20107479/2hajuxw/', JSON.stringify(data));
        }

        // Listen for the beforeunload event to capture when the user is leaving the page
        window.addEventListener('beforeunload', function () {
            sendVisitorData();
        });