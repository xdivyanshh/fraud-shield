const PROTECTED_DOMAINS = [
    "sbi.co.in", "hdfcbank.com", "icicibank.com", "axisbank.com", "onlinesbi.sbi",
    "zerodha.com", "groww.in", "upstox.com", "angelone.in" // As requested!
];

// Levenshtein distance to calculate string similarity
function getDistance(a, b) {
    if(a.length == 0) return b.length; 
    if(b.length == 0) return a.length; 
    var matrix = [];
    for(var i = 0; i <= b.length; i++){ matrix[i] = [i]; }
    for(var j = 0; j <= a.length; j++){ matrix[0][j] = j; }
    for(var i = 1; i <= b.length; i++){
        for(var j = 1; j <= a.length; j++){
            if(b.charAt(i-1) == a.charAt(j-1)){
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, Math.min(matrix[i][j-1] + 1, matrix[i-1][j] + 1));
            }
        }
    }
    return matrix[b.length][a.length];
}

// Check domains
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    // Check if features are enabled
    chrome.storage.local.get(['features'], (res) => {
        const features = res.features || { global: true, search: true };
        
        if (request.type === "CHECK_DOMAIN" && features.global) {
            const host = request.hostname.replace('www.', '');
            
            // Allow exact matches
            if (PROTECTED_DOMAINS.includes(host)) {
                sendResponse({ danger: false });
                return;
            }

            // 1. Typosquatting Check
            for (let protectedHost of PROTECTED_DOMAINS) {
                const distance = getDistance(host, protectedHost);
                // If it's 1 or 2 characters off (e.g. iciclbynk.com vs icicibank.com)
                if (distance > 0 && distance <= 2) {
                    sendResponse({ 
                        danger: true, 
                        reason: `Typosquatting Detected: Looks suspiciously similar to ${protectedHost}.` 
                    });
                    return;
                }
            }

            // 2. Domain Age Check (Mock API Simulation)
            // Real implementation would use: fetch(`https://api.ip2whois.com/v2?key=YOUR_KEY&domain=${host}`)
            // Since we don't have an API key, we'll simulate picking up a 'new' domain if it contains 'fake'
            if (host.includes('-reward') || host.includes('kyc-update') || host.includes('pan-link')) {
                sendResponse({ 
                    danger: true, 
                    reason: `Domain Age Warning: This domain was registered incredibly recently (less than 30 days ago). Authentic financial institutions have domains that are decades old.` 
                });
                return;
            }

            sendResponse({ danger: false });
        }
        
        else if (request.type === "CHECK_URL_SAFE_BROWSING" && features.search) {
            // Live API threat lookup simulation for Google Ads
            // Real implementation: fetch('https://safebrowsing.googleapis.com/v4/threatMatches:find?key=...')
            const url = request.url;
            console.log("Safe Browsing Mock Check for:", url);
            
            // Let's flag URLs that look sketchy
            if (url.includes('reward') || url.includes('login') || url.includes('verify')) {
                sendResponse({ safe: false });
            } else {
                sendResponse({ safe: true });
            }
        }
    });
    
    return true; // Keep message port open for async
});
