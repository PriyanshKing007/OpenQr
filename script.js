const upiIdInput = document.getElementById('upi-id');
const amountInput = document.getElementById('amount');
const websiteLinkInput = document.getElementById('website-link');
const generateBtn = document.getElementById('generate-btn');
const logoUploadInput = document.getElementById('logo-upload');
const dotColorInput = document.getElementById('dot-color');
const bgColorInput = document.getElementById('bg-color');
const fileNameSpan = document.getElementById('file-name');
const typeOptions = document.querySelectorAll('.type-option');
const upiInputs = document.getElementById('upi-inputs');
const linkInputs = document.getElementById('link-inputs');
const qrPreview = document.getElementById('qr-preview');
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

let selectedType = 'upi';
let qrCode = null;

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

// Add input validation and formatting
upiIdInput.addEventListener('input', function() {
    // Remove any spaces
    this.value = this.value.replace(/\s/g, '');
    updatePreview();
});

amountInput.addEventListener('input', function() {
    // Allow only numbers and decimal point
    this.value = this.value.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = this.value.split('.');
    if (parts.length > 2) {
        this.value = parts[0] + '.' + parts.slice(1).join('');
    }
    updatePreview();
});

websiteLinkInput.addEventListener('input', function() {
    updatePreview();
});

dotColorInput.addEventListener('input', updatePreview);
bgColorInput.addEventListener('input', updatePreview);

typeOptions.forEach(option => {
    option.addEventListener('click', () => {
        typeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        selectedType = option.dataset.type;

        if (selectedType === 'upi') {
            upiInputs.style.display = 'block';
            linkInputs.style.display = 'none';
        } else {
            upiInputs.style.display = 'none';
            linkInputs.style.display = 'block';
        }
        
        updatePreview();
    });
});

logoUploadInput.addEventListener('change', () => {
    if (logoUploadInput.files.length > 0) {
        const file = logoUploadInput.files[0];
        // Check if file is an image
        if (!file.type.match('image.*')) {
            alert('Please select an image file (JPEG, PNG, GIF, etc.)');
            logoUploadInput.value = '';
            fileNameSpan.textContent = 'No file chosen';
            return;
        }
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('File size exceeds 2MB limit. Please choose a smaller file.');
            logoUploadInput.value = '';
            fileNameSpan.textContent = 'No file chosen';
            return;
        }
        fileNameSpan.textContent = file.name;
        
        // Read the file and update preview
        const reader = new FileReader();
        reader.onload = function(e) {
            updatePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        fileNameSpan.textContent = 'No file chosen';
        updatePreview();
    }
});

// Update QR code preview
function updatePreview(logoDataUrl = null) {
    let data = '';
    
    if (selectedType === 'upi') {
        const upiId = upiIdInput.value.trim();
        const amount = amountInput.value.trim();
        
        if (upiId) {
            data = `upi://pay?pa=${upiId}`;
            if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
                data += `&am=${amount}`;
            }
        }
    } else {
        let websiteLink = websiteLinkInput.value.trim();
        if (websiteLink) {
            // Ensure the link has a protocol
            if (!websiteLink.startsWith('http://') && !websiteLink.startsWith('https://')) {
                websiteLink = `https://${websiteLink}`;
            }
            data = websiteLink;
        }
    }
    
    // Clear previous QR code
    qrPreview.innerHTML = '';
    
    if (data) {
        // Create new QR code
        qrCode = new QRCodeStyling({
            width: 200,
            height: 200,
            data: data,
            dotsOptions: {
                color: dotColorInput.value || "#000000",
                type: "rounded"
            },
            backgroundOptions: {
                color: bgColorInput.value || "#ffffff",
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 5
            }
        });
        
        // Add logo if available
        if (logoDataUrl) {
            qrCode.update({
                image: logoDataUrl
            });
        } else if (sessionStorage.getItem('logoUrl')) {
            qrCode.update({
                image: sessionStorage.getItem('logoUrl')
            });
        }
        
        qrCode.append(qrPreview);
    } else {
        // Show placeholder
        qrPreview.innerHTML = '<div class="placeholder">Enter data to see preview</div>';
    }
}

generateBtn.addEventListener('click', async () => {
    const dotColor = dotColorInput.value;
    const bgColor = bgColorInput.value;
    let data = '';

    if (selectedType === 'upi') {
        const upiId = upiIdInput.value.trim();
        const amount = amountInput.value.trim();
        
        // Validate UPI ID format (basic validation)
        if (!upiId) {
            alert('Please enter a UPI ID');
            upiIdInput.focus();
            return;
        }
        
        // Basic UPI ID format check (should contain @)
        if (!upiId.includes('@')) {
            alert('Please enter a valid UPI ID (e.g. username@upi)');
            upiIdInput.focus();
            return;
        }
        
        data = `upi://pay?pa=${upiId}`;
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
            data += `&am=${amount}`;
        }
    } else {
        let websiteLink = websiteLinkInput.value.trim();
        if (!websiteLink) {
            alert('Please enter a website link');
            websiteLinkInput.focus();
            return;
        }
        // Ensure the link has a protocol
        if (!websiteLink.startsWith('http://') && !websiteLink.startsWith('https://')) {
            websiteLink = `https://${websiteLink}`;
        }
        data = websiteLink;
    }

    // Handle logo upload
    let logoDataUrl = null;
    if (logoUploadInput.files.length > 0) {
        const reader = new FileReader();
        logoDataUrl = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(logoUploadInput.files[0]);
        });
        sessionStorage.setItem('logoUrl', logoDataUrl);
    } else {
        sessionStorage.removeItem('logoUrl');
    }

    // Show loading state
    const originalBtnText = generateBtn.textContent;
    generateBtn.textContent = 'Generating...';
    generateBtn.disabled = true;

    // Create URL with parameters
    let url = `qr.html?type=${selectedType}&data=${encodeURIComponent(data)}`;
    url += `&dotColor=${encodeURIComponent(dotColor)}`;
    url += `&bgColor=${encodeURIComponent(bgColor)}`;

    // Add slight delay to show loading state
    setTimeout(() => {
        window.location.href = url;
    }, 500);
});

// Add Enter key support for form submission
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        generateBtn.click();
    }
});

// Focus on the first input field when the page loads
window.addEventListener('load', function() {
    upiIdInput.focus();
    updatePreview();
    
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.textContent = '☀️';
    }
});