// We will check if the user has disabled the extension first
chrome.storage.local.get(['features'], (result) => {
    const features = result.features || {};
    if (features.search === false) return; // Google Search Intercept disabled
    
    scanForSponsoredLinks();
});

function scanForSponsoredLinks() {
    console.log("Fraud Shield: Scanning for sponsored links...");

    // Google frequently obfuscates class names for ads to stop adblockers. 
    // The most robust way is to find links that use Google's ad-click tracker service (/aclk)
    const adLinks = document.querySelectorAll('a[href^="https://www.google.com/aclk"], a[href*="/aclk?"]');

    adLinks.forEach(linkElem => {
        // Find the outermost container of this specific ad to highlight
        // We go up a few levels to wrap the whole card
        let adBlock = linkElem.closest('div[data-text-ad="1"], .uEierd, div[role="listitem"]');
        
        // Fallback: If Google changed container classes, just wrap the link's direct grand-parent
        if (!adBlock) {
            adBlock = linkElem.parentElement.parentElement;
        }

        if (adBlock && !adBlock.classList.contains('fraud-shield-scanned')) {
            const url = linkElem.href;
            adBlock.classList.add('fraud-shield-scanned');
            
            // Ask Background script to check Safe Browsing API
            chrome.runtime.sendMessage({ type: "CHECK_URL_SAFE_BROWSING", url: url }, (response) => {
                if (response && response.safe === false) {
                    injectWarningUI(adBlock);
                }
            });
        }
    });

    const observer = new MutationObserver((mutations) => {
        let shouldRescan = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) shouldRescan = true;
        });
        if (shouldRescan) {
            scanSponsoredLinksDynamically();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function scanSponsoredLinksDynamically() {
    const unScannedLinks = document.querySelectorAll('a[href*="/aclk?"]:not(.fraud-shield-scanned-link)');
    
    unScannedLinks.forEach(linkElem => {
        linkElem.classList.add('fraud-shield-scanned-link');
        
        let adBlock = linkElem.closest('div[data-text-ad="1"], .uEierd, div[role="listitem"]');
        if (!adBlock) adBlock = linkElem.parentElement.parentElement;
        
        if (adBlock && !adBlock.classList.contains('fraud-shield-scanned')) {
            adBlock.classList.add('fraud-shield-scanned');
            chrome.runtime.sendMessage({ type: "CHECK_URL_SAFE_BROWSING", url: linkElem.href }, (response) => {
                if (response && response.safe === false) {
                    injectWarningUI(adBlock);
                }
            });
        }
    });
}

function injectWarningUI(adBlock) {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'fraud-shield-warning';
    warningDiv.innerHTML = `<strong>⚠️ Fraud Shield Warning:</strong> This sponsored link matches our threat database. Do not click.`;
    
    adBlock.insertBefore(warningDiv, adBlock.firstChild);
    adBlock.classList.add('fraud-shield-highlight');
}
