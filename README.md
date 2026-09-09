# Pengumuman Kelulusan ORIMA 2026

## Overview
This is a **single‑page web application** that allows prospective students of **ORIMA 2026** to check their graduation results instantly.  The app is built with vanilla **HTML, CSS and JavaScript** – no bundlers or frameworks are required.

## Features
- Animated splash screen with a star‑field background.
- Responsive layout that works on mobile, tablet and desktop.
- Search form to look up a participant by **registration number** and **full name**.
- “Forgot number?” modal that performs a fuzzy name search against a local JSON lookup table.
- Dynamic result card that shows **program of study**, **selection status**, and a printable certificate.
- Easy‑to‑replace data files (`database.json` and `nomor_pendaftaran_nama_ORIMA_2026.json`).

## Project Structure
```
pengumuman kelulusan/
│   index.html          # main page (HTML markup)
│   style.css           # visual design (glass‑morphism, gradients, animations)
│   script.js           # UI logic, form handling, data loading
│   database.json       # master data set with all participants
│   nomor_pendaftaran_nama_ORIMA_2026.json  # name‑to‑number lookup table
│   README.md           # **you are reading it**
└─ assets/               # logo images, icons, etc.
```

## Getting Started (Local Development)
1. **Clone / copy the folder** to your machine.
2. Open a terminal in the project directory.
3. Start a simple static‑file server.  Example commands:
   - **Python 3** (built‑in):
     ```
     python -m http.server 8000
     ```
   - **Node.js (http‑server)**:
     ```
     npx -y http-server -p 8000
     ```
4. Open a browser and navigate to `http://localhost:8000`.
5. The splash screen will appear; click **“Cek Kelulusan Sekarang”** to enter the search form.

### Customising the Data
- **Add / edit participants** – open `database.json` and follow the existing object structure:
  ```json
  {
    "nomor": "015",
    "nama": "Fauzan Hari Ramdani",
    "prodi": "Teknik Informatika",
    "status": "LULUS",
    "pesan": "Selamat! Anda lulus seleksi ORIMA 2026."
  }
  ```
- **Update the name‑lookup table** – edit `nomor_pendaftaran_nama_ORIMA_2026.json` to map names to numbers.  The file is an array of objects `{ "nama": "…", "nomor": "…" }`.
- After any change, simply refresh the browser; the JavaScript loads the JSON files on demand.

## Deployment (Production)
The site can be hosted on **any static‑file web host** (GitHub Pages, Netlify, Vercel, Firebase Hosting, etc.).
1. Push the repository to a remote Git provider.
2. Configure the host to serve the `index.html` as the root document.
3. Ensure the `assets/` folder and both JSON files are uploaded – they are required at runtime.

## Accessibility & SEO
- Proper `<meta charset="UTF-8">` and viewport tags are already included.
- All images use `alt` attributes.
- Semantic HTML sections (`<header>`, `<section>`, `<footer>`) aid screen‑reader navigation.
- Title tag is set to **“Pengumuman Kelulusan ORIMA 2026 – UKM PRIMA UNRAM”**.

## Development Tips
- **Live reload** – use a tool like `live-server` (`npm i -g live-server`) to automatically refresh the page when you edit files.
- **Styling** – the CSS uses custom properties for colors; modify `:root` in `style.css` to change the colour palette.
- **Debugging** – open the browser console (F12) to view any errors from data loading; the script logs useful messages.

## Credits
- **Fonts**: Google Fonts – *Plus Jakarta Sans* and *Cinzel*.
- **Icons**: Font Awesome 6.
- **Background animation**: custom CSS keyframes and JavaScript canvas for confetti.
- **Author**: Kabinet UNI7Y – UKM PRIMA UNRAM.

---
*Happy checking!*
