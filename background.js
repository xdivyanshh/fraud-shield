// Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
    console.log("Fraud Shield Extension Installed successfully.");
    
    // Set default state
    chrome.storage.local.set({ fraudShieldActive: true });
});

// We can add message listeners here if the content script needs to query 
// an API (like Google Safe Browsing) without dealing with CORS issues.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "CHECK_URL") {
        console.log("Checking URL:", request.url);
        // E.g., make fetch() to a threat intelligence API
        sendResponse({ safe: false, reason: "Phishing list match" });
    }
    return true; // Indicates async response
});
