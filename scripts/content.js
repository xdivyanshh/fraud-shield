// We will check if the user has disabled the extension first
chrome.storage.local.get(['features'], (result) => {
    const features = result.features || {};
    if (features.search === false) return; // Google Search Intercept disabled
    
    scanForSponsoredLinks();
});

function scanForSponsoredLinks() {
    console.log("Fraud Shield: Scanning for sponsored links...");

    const potentialAds = document.querySelectorAll('div[data-text-ad="1"], .uEierd');

    potentialAds.forEach(adBlock => {
        const linkElem = adBlock.querySelector('a[href]');
        if (linkElem && !adBlock.classList.contains('fraud-shield-scanned')) {
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
    const potentialAds = document.querySelectorAll('div[data-text-ad="1"]:not(.fraud-shield-scanned), .uEierd:not(.fraud-shield-scanned)');
    potentialAds.forEach(adBlock => {
        const linkElem = adBlock.querySelector('a[href]');
        if (linkElem) {
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
