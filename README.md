<div align="center">
  <h1>🛡️ Fraud Shield</h1>
  <p><strong>A powerful Chrome Extension built to protect users from financial fraud, fake sponsored websites, and email phishing.</strong></p>
</div>

---

## 🚀 Overview

Financial scams cost victims billions every year, and many originate from two primary vectors: **malicious search engine ads** and **highly targeted phishing emails**. 

**Fraud Shield** acts as a silent bodyguard in your browser. It actively scans Google search results for suspected scam ads and injects an intervention banner on high-risk emails in Gmail, helping average users avoid falling victim to cybercriminals.

## ✨ Core Features

### 1. Fake Sponsored Ad Detector (Google Search)
Scammers often purchase "Sponsored" slots on Google targeting high-intent keywords (e.g., "SBI Net Banking"). Fraud Shield:
- Dynamically intercepts search results labeled as *Sponsored*.
- Visually overrides the UI with a bold red warning border.
- Prevents users from blindly clicking on heavily targeted banking keywords without taking a secondary look.

### 2. Deep Email Phishing Scanner (Gmail)
- **Advanced Dictionary Matching:** Scans email text upon opening using an advanced dictionary of financial scam keywords (e.g., `kyc update`, `account suspended`, `bitcoin wallet`, `invoice attached`).
- **Real-Time Intervention:** Automatically injects a massive red alert banner at the top of an email if multiple threat vectors are detected.
- **One-Click Eradication:** Features an automated *Delete This Scam* button that traverses Gmail's dynamic React UI to permanently trash the email with a single click.

## 🛠️ Technology Stack
- **Architecture:** Chrome Extension Manifest V3 (MV3)
- **Frontend Logic:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Background Processes:** Chrome Service Workers
- **Event Handling:** JavaScript `MutationObserver` API for rendering UI natively inside SPAs (like Gmail).

---

## 📥 Installation (Developer Mode)

Since this extension is in active development, it is not yet on the Chrome Web Store. To run it locally:

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/xdivyanshh/fraud-shield.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** in the top right corner.
4. Click **Load unpacked** in the top left menu.
5. Select the cloned `fraud-shield` folder.
6. The extension is now active! Try searching *"buy car insurance"* on Google or open a spam email containing the phrase *"update your KYC"* to see the interventions.

## 🤝 Contribution
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
