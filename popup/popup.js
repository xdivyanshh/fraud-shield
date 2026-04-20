document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-btn');
    const statusIndicator = document.getElementById('status-indicator');
    let isActive = true;

    // Load state from local storage later (for now, simply toggle UI)
    toggleBtn.addEventListener('click', () => {
        isActive = !isActive;
        
        if (isActive) {
            statusIndicator.textContent = 'Active';
            statusIndicator.className = 'active';
            toggleBtn.textContent = 'Disable Protection';
        } else {
            statusIndicator.textContent = 'Inactive';
            statusIndicator.className = 'inactive';
            toggleBtn.textContent = 'Enable Protection';
        }
        
        // Save state
        chrome.storage.local.set({ fraudShieldActive: isActive });
    });

    // Initialize state
    chrome.storage.local.get(['fraudShieldActive'], (result) => {
        if (result.fraudShieldActive !== undefined) {
            isActive = !result.fraudShieldActive; // Invert to simulate click correctly
            toggleBtn.click(); // Trigger UI update
        }
    });
});
