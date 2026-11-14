# AirScape - Real-Time Air Quality & Visual Scene Web App

> **Academic Task Number:** CA1 (Project)  
> **Course Code:** CSE326 | **Course Title:** Internet Programming  
> **Institution:** Lovely Professional University (LPU) | Session 2026–27  
> **Maximum Marks:** 30  
> **Live Demo:** [https://abinav-n-dev.github.io/AirScape/](https://abinav-n-dev.github.io/AirScape/)  
> **Repository:** [https://github.com/abinav-n-dev/AirScape](https://github.com/abinav-n-dev/AirScape)  
> **Tech Stack:** Pure Semantic HTML5, CSS3 (Variables, Flexbox, Grid), Vanilla JavaScript (ES6)  
> **Zero External Dependencies / No Frameworks / No Build Tools / No API Keys Required**

---

## 1. Project Overview & Motivation

### The Real-World Problem
Every winter across Northern India (Punjab, Haryana, Delhi-NCR, Uttar Pradesh), a dangerous convergence occurs:
- Seasonal crop stubble burning (paddy residue) releases massive particulate plumes.
- Winter temperature inversions and low wind speeds trap smoke and industrial pollutants near ground level.
- Dense fog mixes with smog to produce hazardous particulate matter levels (**PM2.5 and PM10** often exceeding 300 to 500 µg/m³).

### Why Existing Weather Apps Fall Short
1. **Abstract Numbers:** Standard apps display an arbitrary number (e.g., `AQI 240`) which fails to convey the immediate visual density or physical danger of the atmosphere.
2. **One-Size-Fits-All Advice:** Standard weather applications give identical advice to everyone. In reality, a healthy 20-year-old athlete and an 8-year-old child with asthma require completely different health precautions.

### What AirScape Does
**AirScape** is a client-side web application that:
1. Translates real-time air quality metrics into a **live CSS-simulated atmospheric sky scene**: the sky gradient, sun disc clarity, and haze opacity adapt smoothly in real time.
2. Computes an **Effective Personal AQI** and personalized health precautions tailored to the user's age, respiratory sensitivity (asthma/allergies), and daily outdoor exposure time.
3. Provides a **24-hour predictive forecast** highlighting the optimal daytime window ("Best Time to Step Outdoors") and the "Worst Pollution Peak".
4. Features an interactive **City Comparison Tool** built with the native **HTML5 Drag and Drop API**.
5. Runs **100% offline-resilient** with hardcoded fallback data for 10 Indian cities if the network drops or API requests fail.

---

## 2. Evaluation Rubrics Alignment (30 / 30 Marks)

| Evaluation Criteria | Allotted Marks | Implementation in AirScape |
| :--- | :---: | :--- |
| **Website Design & User Interface** | **10 Marks** | Clean visual design, consistent typography, standard US EPA color palette via CSS variables, mobile menu toggle, and fully responsive across 360px, 768px, and 1024px+. |
| **Functionality & Technical Implementation** | **10 Marks** | Dynamic 24-hour bar chart loop, HTML5 Drag & Drop city comparison, Geolocation GPS integration, LocalStorage and SessionStorage persistence, Regex form validation, audio event listeners, and zero console errors. |
| **Content Quality & Innovation** | **5 Marks** | Highly relevant to the Punjab/North Indian winter smog crisis. Innovates by replacing static numbers with a dynamic CSS sky simulator and personalized sensitivity-based health formulas. |
| **Viva Voce & Project Demonstration** | **5 Marks** | Clear code organization, short functions with educational comments, fully documented architecture, and quick-reference viva questions below. |
| **Total** | **30 Marks** | **Full Rubric Compliance** |

---

## 3. Course Syllabus Implementation Matrix (CSE326)

This project has been deliberately architected to satisfy all core outcomes of the **CSE326: Internet Programming** syllabus:

| Syllabus Unit | Course Concepts Covered | Implementation in AirScape |
| :--- | :--- | :--- |
| **Unit I: HTML Fundamentals** | Document structure, tags, lists, links, SVG graphics, multimedia (audio, video, iframes), SEO basics | Semantic layout, SVG graphics for landscape skyline, embedded live wind map iframe, audio player with event listeners, accessible metadata and viewport tags |
| **Unit II: Semantic HTML & Forms** | Semantic layout (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`), form controls, input attributes, tables and data representation | Form structure with `<input type="text">`, `<input type="number">`, `<input type="range">`, `<fieldset>`, `<legend>`, error spans, and full HTML5 `<table>` for US EPA AQI breakpoints |
| **Unit III: Cascading Style Sheets** | CSS variables, typography, box model, Flexbox, CSS Grid, pseudo-classes, pseudo-elements, attribute selectors, CSS transitions, CSS animations (`@keyframes`) | Responsive CSS Grid for dashboard, Flexbox for navigation, CSS Variables (`--aqi-*`), CSS transitions for smooth sky shifts, and `@keyframes pulse-live` animation |
| **Unit IV: JavaScript Fundamentals** | Variables, data types, operators, conditional statements, functions, arrays, objects | Pure ES6 JavaScript, clear student-level comments, `if/else` advice engine, array math for 24-hour calculations |
| **Unit V: Interactive Web Development** | Loops, DOM manipulation, event handling, regular expressions, Date API, Web Storage (LocalStorage & SessionStorage), Fetch API, Geolocation API, Drag & Drop API, higher-order functions (`.reduce`, `.filter`, `.map`), closures, audio events | 24-hour forecast loop, Regex form validation, Geolocation GPS lookup, `localStorage` & `sessionStorage` persistence, Drag & Drop comparison, audio event listeners, and higher-order functions |
| **Unit VI: Web Deployment** | Error handling, debugging, responsive testing, static deployment | `try/catch` error boundaries, zero console errors, full responsiveness (360px, 768px, 1024px+), deployed live on GitHub Pages |

---

## 4. Key Technical Features

### A. The CSS Sky Simulator (`updateScene(aqi)`)
Unlike heavy canvas or WebGL libraries, the sky effect uses pure CSS transitions:
- **Sky Gradient:** Shifts smoothly between 6 stages:
  - `0 – 50 (Good):` Clear Azure Blue (`linear-gradient(180deg, #38bdf8, #bae6fd)`)
  - `51 – 100 (Moderate):` Mild Blue-Yellow horizon
  - `101 – 150 (Sensitive):` Dusty Warm Haze (`#94a3b8` to `#fed7aa`)
  - `151 – 200 (Unhealthy):` Sepia Smoggy Orange-Gray
  - `201 – 300 (Very Unhealthy):` Thick Brownish-Orange Smog
  - `301+ (Hazardous):` Apocalyptic Choked Dark Smog (`#292524` to `#7c2d12`)
- **CSS Sun Circle:**
  - In clean air: Bright yellow, sharp disc, vibrant bloom (`box-shadow: 0 0 50px #fde047`).
  - As AQI worsens: Opacity drops to `0.15`, blur increases up to `15px`, and glow extinguishes.
- **CSS Haze Overlay:**
  - An absolute overlay whose opacity transitions dynamically from `0.0` (clean) up to `0.90` (hazardous).

### B. Personalised Health Advice Algorithm
The advice engine uses plain, transparent conditional logic:
1. **Base AQI:** Obtained from live Open-Meteo data or user selection.
2. **Sensitivity Multiplier:**
   $$\text{Multiplier} = 1.0$$
   - If user indicates asthma, allergies, or breathing sensitivity: $\text{Multiplier} \times 1.35$ (+35%)
   - If user age $< 12$ (pediatric) or $\ge 60$ (geriatric): $\text{Multiplier} \times 1.20$ (+20%)
3. **Effective AQI Calculation:**
   $$\text{Effective AQI} = \text{round}(\text{Base AQI} \times \text{Multiplier})$$
4. **Risk Categorization:**
   - $\le 50 \implies \text{Low Risk}$
   - $51 - 100 \implies \text{Mild Risk}$
   - $101 - 150 \implies \text{Elevated Risk}$
   - $151 - 200 \implies \text{High Risk}$
   - $201 - 300 \implies \text{Very High Risk}$
   - $301+ \implies \text{Severe Risk}$
5. **Actionable Output:**
   - Specific mask recommendations (e.g. N95/FFP2 respirator requirement).
   - Window sealing and HEPA filtration reminders.
   - Cumulative dose alerts for planned outdoor exposure ($>2$ hours).
   - Emergency guidance for sensitive groups to keep rescue inhalers accessible.

### C. 24-Hour Forecast & Higher-Order Functions
- JavaScript `for` loop dynamically generates 24 hour columns with proportional bar heights.
- Uses **`Array.prototype.reduce()`** to calculate the daily average AQI.
- Uses **`Array.prototype.filter()`** to count hours exceeding unhealthy limits ($>150$).
- Uses **`Array.prototype.map()`** to transform forecast data points.
- Analyzes hours between **6:00 AM and 9:00 PM** to pinpoint the single cleanest window for outdoor commuting.

### D. HTML5 Drag and Drop City Comparison
- Native HTML5 Drag and Drop API (`draggable="true"`, `dragstart`, `dragover`, `dragleave`, `drop`).
- Drag any city chip into **City A** and **City B** dropzones.
- Computes pollution ratios, difference margins (e.g. *"Delhi's air is worse than Shimla by 248 AQI points"*), and renders a visual proportion bar.
- Includes mobile-friendly `<select>` dropdowns so mobile touchscreen users have full functionality.

### E. Browser Storage (LocalStorage & SessionStorage)
Wrapped inside `try/catch` blocks:
- **`localStorage`:** Saves last selected city, star bookmarks, and health profile inputs.
- **`sessionStorage`:** Tracks the number of searches performed during the active browser session via a JavaScript **closure** (`createSessionSearchTracker()`).

### F. Geolocation & Open-Meteo Free APIs
- **City Geocoding:** `https://geocoding-api.open-meteo.com/v1/search?name=CITY&count=1`
- **Air Quality:** `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=LAT&longitude=LON&current=us_aqi,pm10,pm2_5&hourly=us_aqi&forecast_days=1&timezone=auto`
- **Geolocation API:** `navigator.geolocation.getCurrentPosition()` connects directly to GPS coordinates.
- **Offline Fallback Database:** Full fallback dataset for 10 Indian cities:
  *Ludhiana, Jalandhar, Amritsar, Delhi, Kolkata, Mumbai, Chennai, Bengaluru, Kochi, Shimla*.

---

## 5. Viva Voce Preparation Guide (Sample Questions & Answers)

1. **Q: How does the dynamic sky visualizer work without HTML5 Canvas?**  
   *A:* In `script.js`, `updateScene(aqi)` updates inline CSS styles on three elements: the background gradient of `#sky-scene`, the blur filter/opacity of `#scene-sun`, and the opacity of `#scene-haze`. The smooth transitions are handled entirely by CSS `transition: background 0.8s ease, filter 0.8s ease;`.

2. **Q: How do you handle network failure or missing API keys?**  
   *A:* All `fetch` calls use `async/await` wrapped in `try/catch`. If an HTTP error, offline status, or rate limit occurs, `loadFallbackCity(cityName)` seamlessly loads pre-configured baseline data for 10 Indian cities so the application never renders blank or crashes.

3. **Q: Where have you demonstrated higher-order functions in JavaScript?**  
   *A:* In `renderForecast()` inside `script.js`, we use `Array.prototype.reduce()` to calculate the 24-hour average AQI, `Array.prototype.filter()` to count hours exceeding an AQI of 150, and `Array.prototype.map()` to project hourly metrics.

4. **Q: Where have you demonstrated closures?**  
   *A:* The function `createSessionSearchTracker()` maintains a private `sessionCount` variable enclosed within its lexical scope, returning an inner function that increments and persists the count to `sessionStorage`.

5. **Q: How is the HTML5 Drag and Drop API implemented?**  
   *A:* Draggable chips have `draggable="true"` and a `dragstart` listener setting `dataTransfer.setData("text/plain", cityName)`. The drop targets handle `dragover` (with `e.preventDefault()`) and `drop` (which retrieves the city name with `e.dataTransfer.getData()`) to update the comparison slot.

---

## 6. How to Run Locally & Submit

1. Clone the repository:
   ```bash
   git clone https://github.com/abinav-n-dev/AirScape.git
   cd AirScape
   ```
2. Open `index.html` in any web browser or serve via Python:
   ```bash
   python3 -m http.server 8000
   ```
3. Live GitHub Pages URL: **https://abinav-n-dev.github.io/AirScape/**
