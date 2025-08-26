// History functionality
const historyList = document.getElementById('history-list');
const emptyHistory = document.getElementById('empty-history');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const exportHistoryBtn = document.getElementById('export-history-btn');
const importHistoryBtn = document.getElementById('import-history-btn');
const importFileInput = document.getElementById('import-file');
const editModal = document.getElementById('edit-modal');
const closeModal = document.querySelector('.close');
const editNameInput = document.getElementById('edit-name');
const editNotesInput = document.getElementById('edit-notes');
const saveEditBtn = document.getElementById('save-edit-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

let currentEditIndex = null;

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

// Load and display history on page load
window.addEventListener('load', displayHistory);

// Clear history button
clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all saved QR codes?')) {
        localStorage.removeItem('qrCodeHistory');
        displayHistory();
    }
});

// Export history button
exportHistoryBtn.addEventListener('click', exportHistory);

// Import history button
importHistoryBtn.addEventListener('click', () => {
    importFileInput.click();
});

// Import file input change
importFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        importHistory(file);
    }
    // Reset input
    event.target.value = '';
});

// Close modal when clicking on X
closeModal.addEventListener('click', () => {
    editModal.style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === editModal) {
        editModal.style.display = 'none';
    }
});

// Save edit button
saveEditBtn.addEventListener('click', saveEdit);

// Display QR code history
function displayHistory() {
    try {
        // Get history from localStorage
        const history = JSON.parse(localStorage.getItem('qrCodeHistory') || '[]');
        
        // Clear current history list
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            // Show empty history message
            emptyHistory.style.display = 'block';
            historyList.style.display = 'none';
            return;
        }
        
        // Hide empty history message
        emptyHistory.style.display = 'none';
        historyList.style.display = 'grid';
        
        // Display each history item
        history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            // Format timestamp
            const date = new Date(item.timestamp);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            
            // Create QR code preview
            const qrPreview = document.createElement('div');
            qrPreview.className = 'qr-preview';
            
            // Create QR code
            const qrCode = new QRCodeStyling({
                width: 150,
                height: 150,
                data: item.data,
                dotsOptions: {
                    color: item.dotColor || "#000000",
                    type: "rounded"
                },
                backgroundOptions: {
                    color: item.bgColor || "#ffffff",
                },
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: 5
                }
            });
            
            // Add logo if available
            if (item.logoUrl) {
                qrCode.update({
                    image: item.logoUrl
                });
            }
            
            // Append QR code to preview
            qrCode.append(qrPreview);
            
            // Create item info
            const itemInfo = document.createElement('div');
            itemInfo.className = 'item-info';
            
            // Use custom name if available, otherwise show type
            const itemName = item.name || (item.type === 'upi' ? 'UPI Payment' : 'Website Link');
            
            itemInfo.innerHTML = `
                <div class="item-name">${itemName}</div>
                <div class="item-type">${item.type === 'upi' ? 'UPI Payment' : 'Website Link'}</div>
                <div class="item-data">${item.data}</div>
                ${item.notes ? `<div class="item-notes">${item.notes}</div>` : ''}
                <div class="item-date">${formattedDate}</div>
            `;
            
            // Create item actions
            const itemActions = document.createElement('div');
            itemActions.className = 'item-actions';
            itemActions.innerHTML = `
                <button class="item-btn edit-btn" data-index="${index}">Edit</button>
                <button class="item-btn copy-btn" data-index="${index}">Copy</button>
                <button class="item-btn delete-btn" data-index="${index}">Delete</button>
            `;
            
            // Add event listeners to buttons
            const editBtn = itemActions.querySelector('.edit-btn');
            const copyBtn = itemActions.querySelector('.copy-btn');
            const deleteBtn = itemActions.querySelector('.delete-btn');
            
            editBtn.addEventListener('click', () => {
                openEditModal(index, item);
            });
            
            copyBtn.addEventListener('click', () => {
                copyToClipboard(item.data);
            });
            
            deleteBtn.addEventListener('click', () => {
                deleteFromHistory(index);
            });
            
            // Append all elements to history item
            historyItem.appendChild(qrPreview);
            historyItem.appendChild(itemInfo);
            historyItem.appendChild(itemActions);
            
            // Append history item to list
            historyList.appendChild(historyItem);
        });
    } catch (error) {
        console.error('Error loading history:', error);
        emptyHistory.innerHTML = '<p>Error loading history.</p>';
        emptyHistory.style.display = 'block';
        historyList.style.display = 'none';
    }
}

// Copy to clipboard function
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

// Delete item from history
function deleteFromHistory(index) {
    if (confirm('Are you sure you want to delete this QR code?')) {
        try {
            const history = JSON.parse(localStorage.getItem('qrCodeHistory') || '[]');
            history.splice(index, 1);
            localStorage.setItem('qrCodeHistory', JSON.stringify(history));
            displayHistory();
        } catch (error) {
            console.error('Error deleting from history:', error);
            alert('Failed to delete QR code from history.');
        }
    }
}

// Open edit modal
function openEditModal(index, item) {
    currentEditIndex = index;
    editNameInput.value = item.name || '';
    editNotesInput.value = item.notes || '';
    editModal.style.display = 'flex';
}

// Save edit
function saveEdit() {
    if (currentEditIndex === null) return;
    
    try {
        const history = JSON.parse(localStorage.getItem('qrCodeHistory') || '[]');
        const item = history[currentEditIndex];
        
        // Update item with new name and notes
        item.name = editNameInput.value.trim();
        item.notes = editNotesInput.value.trim();
        
        // Update timestamp
        item.timestamp = new Date().toISOString();
        
        localStorage.setItem('qrCodeHistory', JSON.stringify(history));
        
        // Close modal and refresh display
        editModal.style.display = 'none';
        displayHistory();
        
        // Reset current edit index
        currentEditIndex = null;
    } catch (error) {
        console.error('Error saving edit:', error);
        alert('Failed to save changes.');
    }
}

// Export history
function exportHistory() {
    try {
        const history = JSON.parse(localStorage.getItem('qrCodeHistory') || '[]');
        
        if (history.length === 0) {
            alert('No QR codes to export.');
            return;
        }
        
        // Create export data
        const exportData = {
            exportedAt: new Date().toISOString(),
            qrCodes: history
        };
        
        // Convert to JSON string
        const dataStr = JSON.stringify(exportData, null, 2);
        
        // Create blob and download
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qr-code-history-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('History exported successfully!');
    } catch (error) {
        console.error('Error exporting history:', error);
        alert('Failed to export history.');
    }
}

// Import history
function importHistory(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            let importedQRs = [];
            
            // Check if it's an export file or direct array
            if (Array.isArray(importData)) {
                importedQRs = importData;
            } else if (importData.qrCodes && Array.isArray(importData.qrCodes)) {
                importedQRs = importData.qrCodes;
            } else {
                alert('Invalid file format. Please select a valid QR code history file.');
                return;
            }
            
            if (importedQRs.length === 0) {
                alert('No QR codes found in the file.');
                return;
            }
            
            // Get existing history
            const existingHistory = JSON.parse(localStorage.getItem('qrCodeHistory') || '[]');
            
            // Add imported QR codes to existing history
            const combinedHistory = [...importedQRs, ...existingHistory];
            
            // Limit to 50 items
            if (combinedHistory.length > 50) {
                combinedHistory.splice(50);
            }
            
            // Save to localStorage
            localStorage.setItem('qrCodeHistory', JSON.stringify(combinedHistory));
            
            // Refresh display
            displayHistory();
            
            alert(`Successfully imported ${importedQRs.length} QR codes!`);
        } catch (error) {
            console.error('Error importing history:', error);
            alert('Failed to import history. Please check the file format.');
        }
    };
    reader.readAsText(file);
}

// Apply saved theme on page load
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.textContent = '☀️';
    }
});