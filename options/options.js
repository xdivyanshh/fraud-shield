document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save-btn').addEventListener('click', saveOptions);

function saveOptions() {
    const rawKeywords = document.getElementById('custom-keywords').value;
    const keywordsArray = rawKeywords.split(',')
                                     .map(k => k.trim())
                                     .filter(k => k.length > 0);
                                     
    const enableGmail = document.getElementById('enable-gmail').checked;
    const enableSearch = document.getElementById('enable-search').checked;
    const enableGlobal = document.getElementById('enable-global').checked;

    chrome.storage.local.set({
        customKeywords: keywordsArray,
        features: {
            gmail: enableGmail,
            search: enableSearch,
            global: enableGlobal
        }
    }, () => {
        const status = document.getElementById('status-msg');
        status.style.display = 'inline';
        setTimeout(() => {
            status.style.display = 'none';
        }, 2000);
    });
}

function restoreOptions() {
    chrome.storage.local.get({
        customKeywords: [],
        features: {
            gmail: true,
            search: true,
            global: true
        }
    }, (items) => {
        document.getElementById('custom-keywords').value = items.customKeywords.join(', ');
        document.getElementById('enable-gmail').checked = items.features.gmail;
        document.getElementById('enable-search').checked = items.features.search;
        document.getElementById('enable-global').checked = items.features.global;
    });
}
