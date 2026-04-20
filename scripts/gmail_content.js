// High-probability scam and phishing keywords commonly used to trick victims
const SCAM_KEYWORDS = [
    // Urgency & Threats
    "urgent action required", "account suspended", "immediate attention",
    "will be closed", "account restricted", "prevent account closure",
    "your account has been locked", "unauthorized login attempt",

    // Financial Phishing
    "kyc update", "verify your identity", "update your billing",
    "payment declined", "invoice attached", "overdue payment",
    "confirm your payment", "tax refund", "security alert",

    // Lotteries & Scams
    "you have won", "lottery winner", "claim your prize", 
    "inheritance funds", "selected as the winner", "transfer funds",

    // Typical crypto/investments
    "bitcoin wallet", "crypto giveaway", "guaranteed returns",
    "double your investment"
];

let observerEnabled = true;

// Check if extension is active
chrome.storage.local.get(['fraudShieldActive'], (result) => {
    if (result.fraudShieldActive === false) {
        observerEnabled = false;
        return;
    }
    initGmailObserver();
});

function initGmailObserver() {
    console.log("Fraud Shield: Gmail scanner active");

    const observer = new MutationObserver(() => {
        if (!observerEnabled) return;
        
        // Gmail email bodies are usually contained in dynamic divs. The class '.a3s.aiL' is very common
        // Or '.ii.gt' for the outer email wrapper.
        const openEmails = document.querySelectorAll('.ii.gt:not(.fraud-shield-scanned)');
        
        openEmails.forEach(emailNode => {
            emailNode.classList.add('fraud-shield-scanned');
            analyzeEmailNode(emailNode);
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function analyzeEmailNode(emailNode) {
    const emailText = emailNode.innerText.toLowerCase();
    
    // Count how many scam keywords appear in this email
    let matchingKeywords = [];
    SCAM_KEYWORDS.forEach(keyword => {
        if (emailText.includes(keyword.toLowerCase())) {
            matchingKeywords.push(keyword);
        }
    });

    // If it hits 2 or more flags, it's highly suspicious
    if (matchingKeywords.length >= 2) {
        injectWarningBanner(emailNode, matchingKeywords);
    }
}

function injectWarningBanner(emailNode, keywords) {
    // Traverse up to find a good container to prepend the banner to (often the table row or direct parent)
    // We'll append it just above the actual email body
    
    const banner = document.createElement('div');
    banner.className = 'fraud-shield-gmail-banner';
    
    // Create the message
    const message = document.createElement('div');
    message.innerHTML = `<strong>⚠️ FRAUD SHIELD ALERT:</strong> This email contains highly suspicious language commonly used by scammers:<br>
    <em>Matched triggers: [ ${keywords.join(', ')} ]</em><br>
    Do not click links inside. Protect yourself by deleting it immediately.`;
    
    // Create the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'fraud-shield-delete-btn';
    deleteBtn.innerHTML = '🗑️ Delete This Scam';
    
    deleteBtn.onclick = (e) => {
        e.preventDefault();
        
        // Find Gmail's native delete button. This is tricky.
        // The delete button usually has aria-label="Delete" and role="button", or data-tooltip="Delete"
        const deleteButtons = document.querySelectorAll('div[data-tooltip="Delete"], div[aria-label="Delete"]');
        
        let clicked = false;
        // The first visible ones are usually top toolbar or the open email toolbar.
        deleteButtons.forEach(btn => {
            if (btn.style.display !== 'none' && !clicked) {
                // Try simulating mouse events for dynamic React-like sites
                btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                btn.click();
                clicked = true;
            }
        });
        
        if (!clicked) {
            alert("Fraud Shield could not auto-find the Delete button. Please delete this manually!");
        } else {
            console.log("Fraud Shield: Trashed the email successfully.");
        }
    };

    banner.appendChild(message);
    banner.appendChild(deleteBtn);
    
    // Insert before the email content
    const container = emailNode.parentElement;
    if (container) {
        container.insertBefore(banner, emailNode);
    }
}
