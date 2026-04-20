<div align="center">
  <h1>🛡️ Fraud Shield v2</h1>
  <p><strong>A powerful Chrome Extension built to protect users from financial fraud, fake sponsored websites, typosquatting domains, and email phishing.</strong></p>
</div>

---

## 🚀 Overview

Financial scams cost victims billions every year, and many originate from multiple vectors: **malicious search engine ads**, **typosquatting on bank URLs**, and **highly targeted phishing emails**. 

**Fraud Shield** acts as a silent bodyguard in your browser. It actively scans Google search results, intercepts malicious typosquatted bank websites in real-time, unmasks deceptive email links, and provides a customizable deep-scan for your Gmail inbox.

## ✨ Core Features

### 1. Global Typosquatting & Fake Domain Intercept
If you randomly visit a site that looks like your bank but is misspelled (e.g. `iciclbynk.com`), or if that domain was registered very recently, Fraud Shield throws a massive red full-screen block, protecting your credentials before the page even fully loads.
- *Protected Hubs:* SBI, HDFC, ICICI, Axis, Zerodha, Groww, Upstox, AngelOne.

### 2. Fake Sponsored Ad Detector (Google Search)
Fraud Shield dynamically intercepts search results labeled as *Sponsored* and cross-references them against real-time API threat intel, injecting a bold warning if the domain is malicious.

### 3. Deep Email Phishing Scanner (Gmail)
- **Advanced Dictionary Matching:** Scans email text upon opening using an advanced dictionary. Users can now add **Custom Keywords** via the extension Options menu!
- **Link Unmasking Tooltip:** Hover over *any* link in a Gmail message. Fraud Shield will bypass Google's redirect trackers and float a tooltip showing you exactly what website the link actually goes to.
- **One-Click Eradication:** Features an automated *Delete This Scam* button that traverses Gmail's dynamic React UI to permanently trash the email.

### 4. Custom Options Dashboard
Click 'Options' on the extension to access a beautiful settings dashboard. You can toggle specific protections on or off and input your own comma-separated list of custom words to scan for.

## 🛠️ Technology Stack
- **Architecture:** Chrome Extension Manifest V3 (MV3)
- **Permissions:** `<all_urls>`, `storage`, `tabs`, `activeTab`
- **Logic:** Background Service Workers for async API lookups and Levenshtein Distance computations. Content Scripts for native DOM overrides.

---

## 📥 Installation (Developer Mode)

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/xdivyanshh/fraud-shield.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** in the top right corner.
4. Click **Load unpacked** in the top left menu.
5. Select the cloned `fraud-shield` folder.

## 🤝 Contribution
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
