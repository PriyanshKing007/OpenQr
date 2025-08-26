const qrCodeContainer = document.getElementById('qr-code');
const downloadBtn = document.getElementById('download-btn');
const printBtn = document.getElementById('print-btn');
const shareBtn = document.getElementById('share-btn');
const saveBtn = document.getElementById('save-btn');
const payBtn = document.getElementById('pay-btn');
const simulateScanBtn = document.getElementById('simulate-scan-btn');
const encodedDataDisplay = document.getElementById('encoded-data');
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

let currentQRCode = null;
let currentQRData = null;

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const isLightTheme = body.classList.contains('light-theme');
    
    if (isLightTheme) {
        body.classList.remove('light-theme');
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.add('light-theme');
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    }
}

// Apply saved theme on page load
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.textContent = '☀️';
    }
});

// Add event listener to theme toggle button
themeToggleBtn.addEventListener('click', toggleTheme);

// Wait for the window to load to ensure the QRCodeStyling library is available
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const data = urlParams.get('data');
    const dotColor = urlParams.get('dotColor');
    const bgColor = urlParams.get('bgColor');
    const logoUrl = sessionStorage.getItem('logoUrl');

    if (data) {
        // Decode the data since it was encoded when passed in the URL
        const decodedData = decodeURIComponent(data);
        currentQRData = {
            type: type,
            data: decodedData,
            dotColor: dotColor,
            bgColor: bgColor,
            logoUrl: logoUrl,
            timestamp: new Date().toISOString()
        };
        
        // Display the encoded data
        encodedDataDisplay.textContent = decodedData;
        
        const qrCode = new QRCodeStyling({
            width: 300,
            height: 300,
            data: decodedData,
            dotsOptions: {
                color: dotColor || "#000000",
                type: "rounded"
            },
            backgroundOptions: {
                color: bgColor || "#ffffff",
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 10
            }
        });

        // Add logo if available
        if (logoUrl) {
            qrCode.update({
                image: logoUrl
            });
        }

        qrCode.append(qrCodeContainer);
        currentQRCode = qrCode;

        // Download Button functionality
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            qrCode.download({ name: "qr-code", extension: "png" });
        });

        // Print Button functionality
        printBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.print();
        });

        // Share Button functionality
        shareBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'QR Code',
                        text: 'Scan this QR code',
                        url: window.location.href
                    });
                } catch (error) {
                    console.error('Error sharing:', error);
                    // Fallback for desktops
                    fallbackCopyTextToClipboard(decodedData);
                }
            } else {
                // Fallback for desktops
                fallbackCopyTextToClipboard(decodedData);
            }
        });

        // Save to History functionality
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            saveToHistory();
        });

        if (type === 'upi') {
            payBtn.style.display = 'flex';
            payBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Show success page instead of directly opening the UPI link
                showSuccessPage(decodedData);
            });
        } else if (type === 'link') {
            simulateScanBtn.style.display = 'flex';
            simulateScanBtn.textContent = 'Visit Link';
            simulateScanBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(decodedData, '_blank');
            });
        }

    } else {
        qrCodeContainer.innerHTML = "<p style='color: red; padding: 20px;'>No data found in URL.</p>";
        downloadBtn.style.display = 'none';
        printBtn.style.display = 'none';
        shareBtn.style.display = 'none';
        saveBtn.style.display = 'none';
        payBtn.style.display = 'none';
        simulateScanBtn.style.display = 'none';
        encodedDataDisplay.parentElement.style.display = 'none';
    }
    
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.textContent = '☀️';
    }
});

// Add a fallback for the QR code library in case it fails to load
window.addEventListener('load', function() {
    if (typeof QRCodeStyling === 'undefined') {
        // If the library is not loaded after a delay, show an error
        setTimeout(function() {
            if (typeof QRCodeStyling === 'undefined' && qrCodeContainer) {
                qrCodeContainer.innerHTML = "<p style='color: red; padding: 20px;'>QR Code library failed to load. Please refresh the page.</p>";
            }
        }, 2000);
    }
});

// Fallback function to copy text to clipboard
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        alert(successful ? 'Link copied to clipboard!' : 'Could not copy link to clipboard.');
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        alert('Could not copy link to clipboard.');
    }
    
    document.body.removeChild(textArea);
}

// Save QR code to history
function saveToHistory() {
    if (!currentQRData) {
        alert('No QR code data to save.');
        return;
    }
    
    try {
        // Get existing history from localStorage
        let history = JSON.parse(localStorage.getItem('qrCodeHistory') || '[]');
        
        // Add current QR code to history
        history.unshift(currentQRData);
        
        // Limit history to 50 items
        if (history.length > 50) {
            history = history.slice(0, 50);
        }
        
        // Save to localStorage
        localStorage.setItem('qrCodeHistory', JSON.stringify(history));
        
        // Provide feedback
        alert('QR code saved to history!');
    } catch (error) {
        console.error('Error saving to history:', error);
        alert('Failed to save QR code to history.');
    }
}

// Show success page after UPI payment
function showSuccessPage(upiLink) {
    // Create success page elements
    const container = document.querySelector('.container');
    
    // Hide existing content
    container.innerHTML = `
        <div class="success-page">
            <div class="success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Your UPI payment has been processed successfully.</p>
            <div class="success-details">
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value success">Completed</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${new Date().toLocaleTimeString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${new Date().toLocaleDateString()}</span>
                </div>
            </div>
            <div class="success-actions">
                <button id="continue-btn" class="action-btn">Continue</button>
            </div>
        </div>
    `;
    
    // Add event listener to continue button
    document.getElementById('continue-btn').addEventListener('click', () => {
        // Redirect to UPI link (this is where the actual payment would happen)
        window.location.href = upiLink;
    });
    
    // Apply theme to success page
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}
