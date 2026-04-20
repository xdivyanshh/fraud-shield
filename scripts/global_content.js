chrome.runtime.sendMessage({ type: "CHECK_DOMAIN", hostname: window.location.hostname }, (response) => {
    if (response && response.danger) {
        injectBlockScreen(response.reason);
    }
});

function injectBlockScreen(reason) {
    // Only inject once
    if (document.getElementById('fraud-shield-global-block')) return;

    // Create fullscreen overlay
    const overlay = document.createElement('div');
    overlay.id = 'fraud-shield-global-block';
    
    overlay.innerHTML = `
        <div class="fraud-shield-block-card">
            <h1>🛑 FRAUD SHIELD INTERVENTION</h1>
            <p>We have blocked access to <strong>${window.location.hostname}</strong> because it has been flagged as a high-risk security threat.</p>
            <div class="fraud-shield-reason"><strong>Reason:</strong> ${reason}</div>
            <p>If you proceed, you risk losing sensitive financial data. Close this tab immediately.</p>
            <button id="fraud-shield-leave-btn">Take Me to Safety</button>
            <a href="#" id="fraud-shield-proceed-btn">I understand the risks, let me through (Not Recommended)</a>
        </div>
    `;
    
    // Append to body or html
    if (document.body) {
        document.body.appendChild(overlay);
    } else {
        document.documentElement.appendChild(overlay);
    }

    // Attach events AFTER appending
    setTimeout(() => {
        const leaveBtn = document.getElementById('fraud-shield-leave-btn');
        const proceedBtn = document.getElementById('fraud-shield-proceed-btn');
        
        if (leaveBtn) {
            leaveBtn.addEventListener('click', () => {
                window.location.href = "https://www.google.com";
            });
        }
        
        if (proceedBtn) {
            proceedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                overlay.remove();
            });
        }
    }, 100);
}
