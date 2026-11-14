# AirScape - Real-Time Air Quality & Visual Scene Web App

> **CSE326: Internet Programming Course Project**  
> **Student Academic Project** | Session 2026–27  
> **Tech Stack:** Semantic HTML5, CSS3 (Variables, Flexbox, Grid), Vanilla JavaScript (ES6)  
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
2. **One-Size-Fits-All Advice:** Standard weather applications give identical advice to everyone. In reality, a healthy 20-year-old and an 8-year-old child with asthma require completely different health interventions.

### What AirScape Does
**AirScape** is a client-side web application that:
1. Translates real-time air quality metrics into a **live CSS-simulated atmospheric sky scene**: the sky gradient, sun disc clarity, and haze opacity adapt smoothly in real time.
2. Computes an **Effective Personal AQI** and personalized health precautions tailored to the user's age, respiratory sensitivity (asthma/allergies), and daily outdoor exposure time.
3. Provides a **24-hour predictive forecast** highlighting the optimal daytime window ("Best Time to Step Outdoors") and the "Worst Pollution Peak".
4. Features an interactive **City Comparison Tool** built with the native **HTML5 Drag and Drop API**.
5. Runs **100% offline-resilient** with hardcoded fallback data for 10 Indian cities if the network drops or API requests fail.

---

## 2. Course Syllabus Implementation Matrix (CSE326)

This project has been deliberately architected to satisfy all core outcomes of the **CSE326: Internet Programming** syllabus:

| Syllabus Unit | Course Concepts Covered | Implementation in AirScape |
| :--- | :--- | :--- |
| **Unit I: HTML Fundamentals** | Document structure, tags, lists, links, SVG graphics, SEO basics | Semantic layout, SVG graphics for landscape skyline, accessible metadata and viewport tags |
| **Unit II: Semantic HTML & Forms** | Semantic layout (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`), form controls, input attributes | Form structure with `<input type="text">`, `<input type="number">`, `<input type="range">`, `<fieldset>`, `<legend>`, error spans |
| **Unit III: Cascading Style Sheets** | CSS variables, typography, box model, Flexbox, CSS Grid, pseudo-classes, transitions | Responsive CSS Grid for dashboard, Flexbox for navigation, CSS Variables (`--aqi-*`), CSS transitions for smooth sky shifts |
| **Unit IV: JavaScript Fundamentals** | Variables, data types, operators, conditional statements, functions, arrays, objects | Pure ES6 JavaScript, clear student-level comments, `if/else` advice engine, array math for 24-hour calculations |
| **Unit V: Interactive Web Development** | Loops, DOM manipulation, event handling, regular expressions, Date API, LocalStorage, Fetch API, Geolocation API, Drag & Drop API | 24-hour forecast loop, Regex form validation, Geolocation GPS lookup, `localStorage` persistence, Drag & Drop city comparison |
| **Unit VI: Web Application Deployment** | Error handling, debugging, responsive testing, static deployment | `try/catch` error boundaries, zero console errors, full responsiveness (360px, 768px, 1024px+), GitHub Pages ready |

---

## 3. Key Technical Features

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

### C. 24-Hour Forecast & Activity Planner
- JavaScript `for` loop dynamically generates 24 hour columns with proportional bar heights.
- Analyzes hours between **6:00 AM and 9:00 PM** to pinpoint the single cleanest window for outdoor commuting or grocery trips.
- Identifies the worst pollution peak hour to advise staying indoors.

### D. HTML5 Drag and Drop City Comparison
- Native HTML5 Drag and Drop API (`draggable="true"`, `dragstart`, `dragover`, `dragleave`, `drop`).
- Drag any city chip into **City A** and **City B** dropzones.
- Computes pollution ratios, difference margins (e.g. *"Delhi's air is worse than Shimla by 248 AQI points"*), and renders a visual proportion bar.
- Includes mobile-friendly `<select>` dropdowns so mobile touchscreen users have full functionality.

### E. Persistent Browser Storage (`localStorage`)
Wrapped inside `try/catch` blocks for reliability:
- Saves last selected city and automatically restores it upon return.
- Save button allows saving favourite cities to a quick-access chips bar.
- Remembers user health profile (nickname, age, outdoor hours, sensitivity toggle).

### F. Geolocation & Open-Meteo Free APIs
- **City Geocoding:** `https://geocoding-api.open-meteo.com/v1/search?name=CITY&count=1`
- **Air Quality:** `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=LAT&longitude=LON&current=us_aqi,pm10,pm2_5&hourly=us_aqi&forecast_days=1&timezone=auto`
- **Geolocation API:** `navigator.geolocation.getCurrentPosition()` connects directly to GPS coordinates.
- **Offline Fallback Database:** Full fallback dataset for 10 Indian cities:
  *Ludhiana, Jalandhar, Amritsar, Delhi, Kolkata, Mumbai, Chennai, Bengaluru, Kochi, Shimla*.

---

## 4. Project File Structure

```text
CSE326/
├── index.html        # Semantic HTML5 markup, accessible forms
├── style.css         # CSS3 styling, variables, Flexbox, Grid, transitions, responsive queries
├── script.js         # Pure Vanilla JavaScript: API fetches, DOM manipulation, advice engine
└── README.md         # Academic documentation, problem statement, syllabus mapping
```

---

## 5. How to Run Locally

Because AirScape uses pure client-side web technologies:

1. Open `index.html` directly in any modern web browser (Google Chrome, Firefox, Microsoft Edge, Safari):
   ```bash
   # Linux / macOS
   xdg-open index.html

   # Or serve with Python's built-in lightweight server
   python3 -m http.server 8000
   ```
2. Open `http://localhost:8000` in your browser.

---

## 6. How to Deploy to GitHub Pages

1. Push `index.html`, `style.css`, `script.js`, and `README.md` to your GitHub repository on branch `main`.
2. Go to **Settings > Pages**.
3. Under **Build and deployment > Source**, select **Deploy from a branch**.
4. Choose `main` branch and `/ (root)` folder, then click **Save**.
5. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## 7. Responsive Breakpoints Tested

- **Mobile (360px - 480px):** Single-column layout, touch targets $\ge 44\text{px}$, accessible mobile dropdowns for comparison, horizontal scrolling hourly forecast.
- **Tablet (768px):** 2-column overview grid, side-by-side forecast highlights.
- **Desktop (1024px+):** Full expansive dashboard layout, interactive drag and drop pool, smooth hover transitions.

---

## 8. Health & Legal Disclaimer

*Notice:* AirScape generates health recommendations based on general environmental pollution thresholds (US AQI and WHO particulate guidelines). This web application is created for academic educational purposes and does not constitute medical advice or clinical diagnosis. Users experiencing persistent respiratory discomfort should seek immediate medical consultation.
