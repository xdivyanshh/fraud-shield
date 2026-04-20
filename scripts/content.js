// We will check if the user has disabled the extension first
chrome.storage.local.get(['fraudShieldActive'], (result) => {
    if (result.fraudShieldActive === false) return; // Extension is disabled
    
    scanForSponsoredLinks();
});

function scanForSponsoredLinks() {
    console.log("Fraud Shield: Scanning for sponsored links...");

    // Google uses various classes for sponsored links. We'll look for standard ad markers.
    // E.g., elements containing "Sponsored" text or ad data attributes
    const potentialAds = document.querySelectorAll('div[data-text-ad="1"], .uEierd');

    potentialAds.forEach(adBlock => {
        // Find the main anchor tag within this block
        const linkElem = adBlock.querySelector('a[href]');
        if (linkElem) {
            const url = linkElem.href;
            
            // Dummy logic: If the URL contains something that looks like our bank but isn't
            // For now, let's just highlight ALL sponsored links as a proof of concept
            
            // Mark it to avoid rescanning
            if (!adBlock.classList.contains('fraud-shield-scanned')) {
                adBlock.classList.add('fraud-shield-scanned');
                
                // Inject warning UI
                const warningDiv = document.createElement('div');
                warningDiv.className = 'fraud-shield-warning';
                warningDiv.innerHTML = `<strong>⚠️ Fraud Shield Warning:</strong> This is a sponsored link. Ensure this is the official bank website before clicking.`;
                
                // Prepend warning above the ad
                adBlock.insertBefore(warningDiv, adBlock.firstChild);
                
                // Highlight the ad block
                adBlock.classList.add('fraud-shield-highlight');
                
                // Disable the link from direct clicking for safety (forces them to copy-paste or acknowledge)
                // For MVP, we will just show the warning
            }
        }
    });

    // Create an observer to catch dynamically loaded ads (infinite scroll)
    const observer = new MutationObserver((mutations) => {
        let shouldRescan = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) shouldRescan = true;
        });
        if (shouldRescan) {
            scanSponsoredLinksDynamically(); // debounce this in real production
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function scanSponsoredLinksDynamically() {
    // Simplified rescanner
    const potentialAds = document.querySelectorAll('div[data-text-ad="1"]:not(.fraud-shield-scanned), .uEierd:not(.fraud-shield-scanned)');
    potentialAds.forEach(adBlock => {
        adBlock.classList.add('fraud-shield-scanned');
        
        const warningDiv = document.createElement('div');
        warningDiv.className = 'fraud-shield-warning';
        warningDiv.innerHTML = `<strong>⚠️ Fraud Shield Warning:</strong> This is a sponsored link. Be careful.`;
        
        adBlock.insertBefore(warningDiv, adBlock.firstChild);
        adBlock.classList.add('fraud-shield-highlight');
    });
}
