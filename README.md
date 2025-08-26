# ProQR — All‑in‑one QR toolkit

[![Live Demo](https://img.shields.io/badge/demo-proqr.wuaze.com-2ea44f?logo=google-chrome)](https://proqr.wuaze.com)
![Status](https://img.shields.io/badge/privacy-client--side%20only-blue)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A modern, open-source, all-in-one QR code experience that goes way beyond “generate & download.” Create instant UPI payment QRs and website link QRs, customize with logos and color themes, preview in real time, scan QRs live in your browser, and manage your entire history — all with a polished, animated UI and a privacy-first, fully client-side architecture.

- Live site: https://proqr.wuaze.com

---

## ✨ Features

- Dual modes
  - Instant UPI payment QR (UPI VPA, amount, name, note, etc.)
  - Automatic website link QR
- Pro-level customization
  - Logo embedding
  - Color themes, sizes, and margins
  - Real-time previews
- Full lifecycle tools
  - View, download, print, and share
  - Save with notes and timestamps
  - History, search, and one-click reuse
  - Import/Export history for easy backup/restore
- Built-in scanner
  - Real-time QR scanning using your device camera
  - Smart error handling and friendly guidance
- UX niceties
  - Clean dark/light theme system
  - Smooth animations and polished interactions
  - Keyboard- and touch-friendly
- Privacy-first
  - 100% client-side (no servers, no tracking)
  - Your data stays on your device

---

## 🚀 Quick start

Use it online:
- Open the live app: https://proqr.wuaze.com
- No sign-up needed. Everything runs locally in your browser.

Run locally (pick one):
1) Static (no build tools)
- Clone or download this repo
- Open index.html in a modern browser
- For camera/scanner to work locally, serve over http(s). Example:
  - Using Node: npx serve .
  - VS Code: Live Server extension

2) With Node (if package.json is present)
- Install: npm install
- Dev server: npm run dev
- Build: npm run build
- Preview: npm run preview

Self-host
- Any static host works: GitHub Pages, Netlify, Vercel, Cloudflare Pages, Nginx, Apache, etc.
- Ensure the site is served over HTTPS so the camera API is available for scanning.

---

## 🧑‍🏫 Usage

Generate a QR
1) Pick a mode: UPI or Link
2) Fill in the fields (e.g., UPI VPA, amount, name; or a website URL)
3) Customize colors, size, and add a logo (optional)
4) Preview updates in real time
5) Save to history (add a note if you like), Download (PNG/SVG), Print, or Share

Scan a QR
- Open the built-in scanner
- Grant camera permission
- Point your camera at any QR to decode it instantly
- Copy/open the result, or save it to your history

History management
- Every saved QR stores details, notes, and timestamps
- Search, filter, and reuse entries
- Backup or migrate with Import/Export (JSON)

Tips for reliable scanning
- Keep embedded logos small and high-contrast
- Use clear colors with good contrast from the background
- Print at sufficient size if you expect distant scanning

Note on UPI
- UPI is India’s Unified Payments Interface. When scanned, UPI QRs open the payer’s UPI-enabled app. Always verify the payee VPA before making payments.

---

## 🔐 Privacy

- 100% client-side. No servers, no database, and no analytics are required for core features.
- Your history and settings are stored in your browser (on-device).
- Nothing leaves your device unless you explicitly share or export it.

---

## 💻 Browser support

- Works best on modern, evergreen browsers (Chrome, Edge, Firefox, Safari).
- Camera access (for the scanner) requires HTTPS and user permission.
- iOS Safari may prompt for camera permission per session.

---

## 🛠️ Tech highlights

- Modern web platform APIs (Canvas, MediaDevices)
- Theming with CSS variables (dark/light)
- Zero required backend; deploy anywhere as a static app

---

## 🧩 Roadmap ideas

- More QR types (Wi-Fi, contact cards, email, SMS, geo)
- Advanced styling presets and templates
- Batch/bulk QR generation
- PWA installability and offline enhancements
- Multi-language support
- Optional error correction and shape styling controls

Have ideas? Open an issue or a discussion!

---

## 🤝 Contributing

Contributions are welcome!  
- Fork the repo
- Create a feature branch: git checkout -b feat/amazing-thing
- Commit changes: git commit -m "Add amazing thing"
- Push branch: git push origin feat/amazing-thing
- Open a Pull Request

Please read CONTRIBUTING.md and follow any code style or PR guidelines. Be kind and constructive in reviews!

Security
- If you find a vulnerability, please do not open a public issue. Email the maintainers or use a private disclosure channel.

---

## 📸 Screenshots

Add a few visuals to help users quickly understand the UI:
- docs/screenshots/home.png
- docs/screenshots/customize.png
- docs/screenshots/scanner.png
- docs/screenshots/history.png

Example (replace with your images):
![ProQR screenshot](docs/screenshots/home.png)

---

## 📄 License

This project is open source under the MIT License. See LICENSE for details.

---

## 🙌 Acknowledgements

- The amazing open web platform and the communities behind QR standards
- Everyone who stars, shares, files issues, and contributes

If you use this in your own project, we’d love a shout-out. And if you ship an improvement, PRs are always welcome!
