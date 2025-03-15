// Create the alert container if it doesn't exist
function createAlertContainer() {
    let container = document.getElementById('custom-alert-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'custom-alert-container';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            width: 80%;
            max-width: 600px;
            text-align: center;
        `;
        document.body.appendChild(container);
    }
    return container;
}

// Create and show the alert
function showCustomAlert(message, type = 'info') {
    const container = createAlertContainer();
    const alert = document.createElement('div');
    
    alert.className = `alert alert-${type} fade show`;
    alert.style.cssText = `
        margin-bottom: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        padding: 20px;
        font-size: 1.2rem;
        position: relative;
        border-radius: 8px;
    `;
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = `
        position: absolute;
        right: 10px;
        top: 10px;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        padding: 0 5px;
    `;
    closeBtn.innerHTML = '×';
    closeBtn.onclick = function() {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 150);
    };

    // Add message and close button
    const messageDiv = document.createElement('div');
    messageDiv.style.marginRight = '20px';  // Space for close button
    messageDiv.textContent = message;
    
    alert.appendChild(messageDiv);
    alert.appendChild(closeBtn);
    container.appendChild(alert);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 150);
    }, 5000);
}

// Override the default alert
window.alert = function(message) {
    showCustomAlert(message);
};

// Additional helper functions for different alert types
window.successAlert = function(message) {
    showCustomAlert(message, 'success');
};

window.errorAlert = function(message) {
    showCustomAlert(message, 'danger');
};

window.warningAlert = function(message) {
    showCustomAlert(message, 'warning');
};