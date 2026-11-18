# AirScape

A simple air quality and smog monitoring web page built using pure HTML, CSS, and JavaScript.

It shows the AQI (Air Quality Index) for different Indian cities, changes the background sky color depending on how bad the pollution is, and gives personalized health tips.

Live Demo: https://abinav-n-dev.github.io/AirScape/

## Features
- Dynamic Sky: The sky changes color from blue (clean) to yellow, orange, and brown (smoggy) depending on AQI.
- City Selection: Check air quality for 10 cities (Delhi, Amritsar, Jalandhar, Ludhiana, Mumbai, etc.).
- Live API & Offline Mode: Uses Open-Meteo free API to fetch live data. If internet disconnects or API fails, it falls back to hardcoded city data so it never breaks.
- Health Advice Calculator: Put your age, outdoor hours, and if you have asthma to calculate your risk level and get health tips.
- Drag and Drop Compare: Drag two cities into the compare boxes to see which one has worse air quality.
- 24-Hour Forecast: Simple bar chart showing hourly AQI for today.
- Ambient Soundscape: Background breeze audio button with web audio fallback.

## Files
- `index.html` - All HTML markup, forms, tables, and sections.
- `style.css` - Custom styling, colors, and layout (Grid + Flexbox).
- `script.js` - All JavaScript logic, API fetch, drag and drop, and DOM updates.
- `ambient-sound.mp3` / `ambient-sound.wav` - Background sound files.

## How to Run

1. Clone or download this repo:
```
git clone https://github.com/abinav-n-dev/AirScape.git
cd AirScape
```

2. Open it:
- Easiest way: Just double-click `index.html` in your file manager to open it in Chrome, Edge, or Firefox.
- In VS Code: Right-click `index.html` and click "Open with Live Server".
- Using Python terminal:
```
python -m http.server
```
Then go to `http://localhost:8000` in your browser.

## Built With
- Pure HTML5
- Pure CSS3 (no Bootstrap, no Tailwind)
- Vanilla JavaScript ES6 (no React, no jQuery, no npm packages)
- Open-Meteo Air Quality API
