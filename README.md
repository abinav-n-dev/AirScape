# AirScape - Real-Time Air Quality & Atmospheric Scene Visualizer

> An open-source, client-side web application that translates real-time air pollution data into an interactive, visual atmospheric scene with personalized health guidance.
>
> **Live Web App:** [https://abinav-n-dev.github.io/AirScape/](https://abinav-n-dev.github.io/AirScape/)  
> **Source Code:** [https://github.com/abinav-n-dev/AirScape](https://github.com/abinav-n-dev/AirScape)  
> **Technology Stack:** Pure HTML5, CSS3 (Variables, Flexbox, Grid, Animations), Vanilla JavaScript (ES6)  
> **Zero External Dependencies / No Frameworks / No Build Steps / No API Keys Required**

---

## 1. Project Motivation & Problem Statement

### The North Indian Winter Air Quality Crisis
Every winter across Northern India (Punjab, Haryana, Delhi-NCR, Uttar Pradesh), a seasonal environmental crisis unfolds:
- Agricultural stubble burning releases large plumes of particulate matter into the regional atmosphere.
- Low surface temperatures and weak wind speeds trigger temperature inversions, trapping vehicle exhaust and industrial emissions near ground level.
- Dense fog merges with particulates to form hazardous smog, pushing **PM2.5 and PM10** concentrations to hazardous levels (often 300 to 500+ µg/m³).

### Why Traditional Weather Apps Fall Short
1. **Abstract Numbers Without Context:** Most weather applications display a single arbitrary number (e.g. `AQI 220`), which fails to convey the physical reality or optical density of the smog outside.
2. **One-Size-Fits-All Advice:** Standard platforms issue identical generic cautions to all individuals. A healthy adult athlete, an elderly citizen, and an asthmatic child face drastically different physiological risks and require distinct protective precautions.

### How AirScape Solves This
**AirScape** bridges the gap between atmospheric data and daily human decisions:
- **Atmospheric Sky Simulator:** Renders a dynamic horizon window where the sky gradient, solar disk blur, and haze opacity dynamically shift in real time with the AQI.
- **Personalized Exposure Algorithm:** Calculates an **Effective AQI** scaled by +35% for respiratory conditions and +20% for pediatric and elderly age groups.
- **24-Hour Predictive Planning:** Scans hourly forecasts to pinpoint the safest daytime outdoor window (between 6 AM and 9 PM) and warns against peak pollution hours.
- **Side-by-Side City Comparison:** Employs the native HTML5 Drag and Drop API to compare pollution levels and calculate relative toxicity ratios between cities.
- **Offline Resilience:** Pre-caches detailed baseline datasets for 10 Indian cities so the application remains fully functional during network interruptions.

---

## 2. Technical Architecture & Web Standards

AirScape is built strictly using web standards and vanilla technologies without third-party frameworks, libraries, or build pipelines.

| Architecture Layer | Core Concepts Implemented | Technical Details |
| :--- | :--- | :--- |
| **Semantic HTML5** | Structural semantics, form controls, SVG, multimedia, tables | Built with `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>`. Features accessible form controls (`<fieldset>`, `<legend>`, range slider), inline SVG horizon silhouettes, an embedded regional wind/particulate radar (`<iframe>`), an audio advisory player (`<audio>`), and an EPA breakpoint reference table (`<table>`). |
| **Modern CSS3 Design System** | Custom properties, layouts, transitions, keyframes | Uses CSS Variables (`:root`) for color tokens and standard EPA category thresholds (`--aqi-good` through `--aqi-hazardous`). Layouts use responsive CSS Grid and Flexbox. Changes in air quality drive hardware-accelerated CSS transitions (`0.8s ease`). The live indicator uses `@keyframes pulse-live` for visual presence. |
| **Client-Side JavaScript (ES6)** | Functional programming, DOM manipulation, events | Pure ES6 JavaScript with short, modular functions and descriptive documentation. Handles user inputs, search parsing, and dynamic UI rendering without page reloads. Includes higher-order functions (`.reduce()` for daily averages, `.filter()` for unhealthy hours, `.map()` for data transformations). |
| **Browser APIs** | Geolocation, Web Storage, Drag & Drop, Audio events | Integrated with `navigator.geolocation.getCurrentPosition()` for GPS tracking. HTML5 Drag and Drop API powers city comparison cards. Web Storage API manages both persistent favorites (`localStorage`) and session query counts (`sessionStorage`) via a lexical closure. Native audio event listeners monitor playback lifecycles. |
| **Network & Resilience** | Fetch API, error boundaries, offline caching | REST integration with free Open-Meteo Geocoding and Air Quality endpoints using `async/await` and `try/catch`. Gracefully falls back to hardcoded datasets for 10 Indian cities (*Ludhiana, Jalandhar, Amritsar, Delhi, Kolkata, Mumbai, Chennai, Bengaluru, Kochi, Shimla*) if offline. |

---

## 3. Core Features Deep Dive

### A. The CSS Atmospheric Sky Simulator (`updateScene(aqi)`)
Rather than relying on resource-intensive canvas rendering, the atmospheric scene uses pure CSS transitions:
- **Sky Gradient:** Dynamically transitions across 6 environmental states:
  - `0 – 50 (Good):` Clear Azure Blue (`linear-gradient(180deg, #38bdf8, #bae6fd)`)
  - `51 – 100 (Moderate):` Soft Blue with mild horizon pale yellow
  - `101 – 150 (Sensitive):` Dusty Warm Haze (`#94a3b8` to `#fed7aa`)
  - `151 – 200 (Unhealthy):` Sepia Smoggy Orange-Gray
  - `201 – 300 (Very Unhealthy):` Thick Brownish-Orange Smog
  - `301+ (Hazardous):` Dense Apocalyptic Smog Blanket (`#292524` to `#7c2d12`)
- **Sun Attenuation:** In clean air, the sun appears sharp and vibrant (`box-shadow: 0 0 50px #fde047`). As particulate density rises, opacity decreases to `0.15` and optical filter blur increases up to `15px`.
- **Haze Ingress:** An absolute haze layer increases in opacity from `0.0` to `0.90` as particulate concentrations rise.

### B. Personalized Health Advisory Formula
Health guidance uses plain, transparent mathematical logic:
1. **Base AQI:** Sourced from real-time Open-Meteo observations or user selection.
2. **Vulnerability Scaling:**
   $$\text{Multiplier} = 1.0$$
   - Asthma / Allergy / Respiratory Sensitivity: $\text{Multiplier} \times 1.35$ (+35%)
   - Age Under 12 or Age 60+: $\text{Multiplier} \times 1.20$ (+20%)
3. **Effective AQI:**
   $$\text{Effective AQI} = \text{round}(\text{Base AQI} \times \text{Multiplier})$$
4. **Actionable Recommendations:**
   - Specific respirator requirements (N95/FFP2 masks).
   - Window sealing and indoor air filtration reminders.
   - Cumulative exposure warnings for outdoor durations exceeding 2 hours.
   - Rapid-access medication reminders for sensitive individuals.

### C. 24-Hour Trend & Activity Planning
- Constructs 24 hourly bar columns dynamically using JavaScript.
- Evaluates hours between **6:00 AM and 9:00 PM** to identify the optimal window for outdoor activities.
- Flags the day's peak pollution window to prevent outdoor exercise during dangerous intervals.

### D. HTML5 Drag & Drop City Comparison
- Native drag-and-drop mechanics (`draggable="true"`, `dragstart`, `dragover`, `dragleave`, `drop`).
- Drag any city chip into Slot A or Slot B to compute pollution difference margins and relative ratios (e.g. *Delhi is 3.8x more polluted than Shimla*).
- Includes mobile-friendly `<select>` dropdown menus for touchscreens.

---

## 4. Project File Structure

```text
AirScape/
├── index.html        # Semantic HTML5 markup, forms, table, media elements
├── style.css         # CSS3 styling, variables, Flexbox, Grid, transitions, animations
├── script.js         # Pure Vanilla JavaScript: APIs, DOM logic, advice engine, storage
└── README.md         # Architecture documentation, problem statement, technical guide
```

---

## 5. Technical Questions & Architecture FAQ

1. **How is the visual sky engine implemented without external graphic libraries?**  
   In `script.js`, `updateScene(aqi)` recalculates inline style properties on three elements: the background gradient of `#sky-scene`, the blur filter/opacity of `#scene-sun`, and the opacity of `#scene-haze`. The transitions are handled by CSS `transition: background 0.8s ease, filter 0.8s ease;`.

2. **How does the application ensure uptime during network outages?**  
   Every API request is wrapped in an `async/await` `try/catch` block. If the geocoding or air quality endpoint fails or the user is disconnected, `loadFallbackCity()` instantly activates pre-configured data for 10 representative Indian cities.

3. **Where are higher-order functions utilized?**  
   Inside `renderForecast()` in `script.js`:
   - `Array.prototype.reduce()` calculates the 24-hour mean AQI.
   - `Array.prototype.filter()` isolates hours exceeding unhealthy thresholds ($>150$).
   - `Array.prototype.map()` transforms raw values into hourly metric objects.

4. **How are closures applied in the state layer?**  
   `createSessionSearchTracker()` encapsulates a private `sessionCount` integer within its lexical scope, returning an inner function that increments and writes the count to `sessionStorage`.

5. **How does the Drag and Drop API transfer state?**  
   Draggable chips set their city identifier on `dragstart` using `event.dataTransfer.setData("text/plain", cityName)`. The drop targets prevent default handling on `dragover` and read the payload on `drop` via `event.dataTransfer.getData("text/plain")` to trigger side-by-side analysis.

---

## 6. Local Setup & GitHub Pages Deployment

### Running Locally
Open `index.html` directly in any web browser, or launch a lightweight server:
```bash
# Clone the repository
git clone https://github.com/abinav-n-dev/AirScape.git
cd AirScape

# Serve via Python's built-in HTTP server
python3 -m http.server 8000
```
Visit `http://localhost:8000` in your browser.

### GitHub Pages Deployment
1. Push `index.html`, `style.css`, `script.js`, and `README.md` to the `main` branch.
2. In your GitHub repository, navigate to **Settings > Pages**.
3. Under **Build and deployment > Source**, select **Deploy from a branch** (`main` / root).
4. The application deploys to: **`https://<your-username>.github.io/AirScape/`**

---

## 7. Responsive Breakpoints

- **Mobile (360px – 480px):** Single-column layout, touch targets $\ge 44\text{px}$, horizontal-scrolling hourly charts, mobile comparison dropdowns.
- **Tablet (768px):** Two-column card grid, side-by-side forecast highlights.
- **Desktop (1024px+):** Full expansive dashboard layout, interactive drag-and-drop pool, smooth hover elevations.

---

## 8. Disclaimer

*Notice:* AirScape generates preventive health guidance based on standard environmental benchmarks (US EPA AQI). This application is intended for educational and public health awareness and does not constitute clinical medical diagnosis. Users with severe or persistent respiratory symptoms should seek medical consultation.
