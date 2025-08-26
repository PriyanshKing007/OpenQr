// Scanner functionality
const cameraFeed = document.getElementById('camera-feed');
const scannerCanvas = document.getElementById('scanner-canvas');
const cameraPlaceholder = document.getElementById('camera-placeholder');
const startCameraBtn = document.getElementById('start-camera-btn');
const stopCameraBtn = document.getElementById('stop-camera-btn');
const scanOverlay = document.getElementById('scan-overlay');
const resultContainer = document.getElementById('result-container');
const scannedData = document.getElementById('scanned-data');
const copyBtn = document.getElementById('copy-btn');
const openBtn = document.getElementById('open-btn');
const scanAgainBtn = document.getElementById('scan-again-btn');
const errorMessage = document.getElementById('error-message');
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

let stream = null;
let scanning = false;
let scanInterval = null;

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

// Start camera function
async function startCamera() {
    try {
        errorMessage.style.display = 'none';
        
        // Get camera stream
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        
        cameraFeed.srcObject = stream;
        cameraFeed.classList.add('active');
        cameraPlaceholder.style.display = 'none';
        scanOverlay.classList.add('active');
        startCameraBtn.style.display = 'none';
        stopCameraBtn.style.display = 'block';
        
        // Start scanning for QR codes
        startScanning();
    } catch (err) {
        console.error('Error accessing camera:', err);
        showError('Could not access camera. Please ensure you\'ve granted permission and that your device has a camera.');
        stopCamera();
    }
}

// Stop camera function
function stopCamera() {
    scanning = false;
    
    if (scanInterval) {
        clearInterval(scanInterval);
        scanInterval = null;
    }
    
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        stream = null;
    }
    
    cameraFeed.classList.remove('active');
    cameraPlaceholder.style.display = 'flex';
    scanOverlay.classList.remove('active');
    startCameraBtn.style.display = 'block';
    stopCameraBtn.style.display = 'none';
}

// Start scanning for QR codes
function startScanning() {
    scanning = true;
    
    // Set up canvas for image processing
    const canvasContext = scannerCanvas.getContext('2d');
    
    // Scan for QR codes every 200ms
    scanInterval = setInterval(() => {
        if (cameraFeed.readyState === cameraFeed.HAVE_ENOUGH_DATA) {
            scannerCanvas.height = cameraFeed.videoHeight;
            scannerCanvas.width = cameraFeed.videoWidth;
            canvasContext.drawImage(cameraFeed, 0, 0, scannerCanvas.width, scannerCanvas.height);
            
            const imageData = canvasContext.getImageData(0, 0, scannerCanvas.width, scannerCanvas.height);
            
            // Use jsQR to scan for QR codes
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            
            if (code) {
                // QR code found
                showScanResult(code.data);
            }
        }
    }, 200);
}

// Show scan result
function showScanResult(data) {
    scanning = false;
    stopCamera();
    
    scannedData.textContent = data;
    resultContainer.style.display = 'block';
}

// Copy scanned data to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

// Fallback copy function
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
        alert(successful ? 'Copied to clipboard!' : 'Could not copy to clipboard.');
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        alert('Could not copy to clipboard.');
    }
    
    document.body.removeChild(textArea);
}

// Event listeners
startCameraBtn.addEventListener('click', startCamera);

stopCameraBtn.addEventListener('click', stopCamera);

copyBtn.addEventListener('click', () => {
    copyToClipboard(scannedData.textContent);
});

openBtn.addEventListener('click', () => {
    const url = scannedData.textContent;
    if (url.startsWith('http://') || url.startsWith('https://')) {
        window.open(url, '_blank');
    } else if (url.startsWith('upi://')) {
        window.location.href = url;
    } else {
        alert('This content cannot be opened directly. You can copy it instead.');
    }
});

scanAgainBtn.addEventListener('click', () => {
    resultContainer.style.display = 'none';
    startCamera();
});

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Stop camera when leaving the page
window.addEventListener('beforeunload', () => {
    stopCamera();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause scanning when tab is not visible
        if (scanning) {
            stopCamera();
        }
    } else {
        // Resume scanning when tab becomes visible again
        if (stream && startCameraBtn.style.display === 'none') {
            startCamera();
        }
    }
});

// Apply saved theme on page load
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.textContent = '☀️';
    }
});