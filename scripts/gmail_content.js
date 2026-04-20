// High-probability scam and phishing keywords commonly used to trick victims
let SCAM_KEYWORDS = [
    "urgent action required", "account suspended", "immediate attention",
    "will be closed", "account restricted", "prevent account closure",
    "your account has been locked", "unauthorized login attempt",
    "kyc update", "verify your identity", "update your billing",
    "payment declined", "invoice attached", "overdue payment",
    "confirm your payment", "tax refund", "security alert",
    "you have won", "lottery winner", "claim your prize", 
    "inheritance funds", "selected as the winner", "transfer funds",
    "bitcoin wallet", "crypto giveaway", "guaranteed returns"
];

let observerEnabled = true;

chrome.storage.local.get(['features', 'customKeywords'], (result) => {
    const features = result.features || {};
    if (features.gmail === false) {
        observerEnabled = false;
        return;
    }
    
    // Add custom keywords from options
    if (result.customKeywords && result.customKeywords.length > 0) {
        SCAM_KEYWORDS = SCAM_KEYWORDS.concat(result.customKeywords.map(k => k.toLowerCase()));
        console.log("Fraud Shield: Loaded custom keywords:", result.customKeywords);
    }
    
    initGmailObserver();
});

function initGmailObserver() {
    console.log("Fraud Shield: Gmail scanner active");

    const observer = new MutationObserver(() => {
        if (!observerEnabled) return;
        
        const openEmails = document.querySelectorAll('.ii.gt:not(.fraud-shield-scanned)');
        
        openEmails.forEach(emailNode => {
            emailNode.classList.add('fraud-shield-scanned');
            analyzeEmailNode(emailNode);
            injectLinkUnmasker(emailNode);
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function analyzeEmailNode(emailNode) {
    const emailText = emailNode.innerText.toLowerCase();
    
    let matchingKeywords = [];
    SCAM_KEYWORDS.forEach(keyword => {
        if (emailText.includes(keyword.toLowerCase())) {
            matchingKeywords.push(keyword);
        }
    });

    if (matchingKeywords.length >= 2) {
        injectWarningBanner(emailNode, matchingKeywords);
    }
}

function injectLinkUnmasker(emailNode) {
    // Advanced Feature: Link Unmasking
    const links = emailNode.querySelectorAll('a[href]');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            // Find true url
            let trueUrl = link.href;
            
            // Gmail sometimes redirects via https://www.google.com/url?q=...
            if (trueUrl.includes('google.com/url?q=')) {
                try {
                    const urlParams = new URLSearchParams(new URL(trueUrl).search);
                    trueUrl = urlParams.get('q') || trueUrl;
                } catch(err) {}
            }
            
            let tooltip = document.getElementById('fraud-shield-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'fraud-shield-tooltip';
                document.body.appendChild(tooltip);
            }
            
            tooltip.innerHTML = `<strong>True Destination:</strong><br><span style="color:#ffcdd2">${trueUrl}</span>`;
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY + 10 + 'px';
            tooltip.style.display = 'block';
        });
        
        link.addEventListener('mousemove', (e) => {
            const tooltip = document.getElementById('fraud-shield-tooltip');
            if (tooltip) {
                tooltip.style.left = e.pageX + 10 + 'px';
                tooltip.style.top = e.pageY + 10 + 'px';
            }
        });
        
        link.addEventListener('mouseleave', () => {
            const tooltip = document.getElementById('fraud-shield-tooltip');
            if (tooltip) tooltip.style.display = 'none';
        });
    });
}

function injectWarningBanner(emailNode, keywords) {
    const banner = document.createElement('div');
    banner.className = 'fraud-shield-gmail-banner';
    
    const message = document.createElement('div');
    message.innerHTML = `<strong>⚠️ FRAUD SHIELD ALERT:</strong> Suspicious language commonly used by scammers detected:<br>
    <em>Matched triggers: [ ${keywords.join(', ')} ]</em><br>
    Do not click links inside. Protect yourself by deleting it immediately.`;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'fraud-shield-delete-btn';
    deleteBtn.innerHTML = '🗑️ Delete This Scam';
    
    deleteBtn.onclick = (e) => {
        e.preventDefault();
        const deleteButtons = document.querySelectorAll('div[data-tooltip="Delete"], div[aria-label="Delete"]');
        let clicked = false;
        deleteButtons.forEach(btn => {
            if (btn.style.display !== 'none' && !clicked) {
                btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                btn.click();
                clicked = true;
            }
        });
        if (!clicked) alert("Please delete manually!");
    };

    banner.appendChild(message);
    banner.appendChild(deleteBtn);
    
    const container = emailNode.parentElement;
    if (container) container.insertBefore(banner, emailNode);
}
