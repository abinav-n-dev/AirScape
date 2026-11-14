// =============================================================================
// AirScape - CSE326 (Internet Programming) Course Project
// Pure Vanilla JavaScript Application (No frameworks, No build step)
// Concepts Demonstrated: DOM Manipulation, Fetch API, Geolocation API,
// Web Storage (localStorage), Drag & Drop API, Regular Expressions, Form Events.
// =============================================================================

// -----------------------------------------------------------------------------
// Global Application State (Simple student variables)
// -----------------------------------------------------------------------------
let currentCity = "Delhi";
let currentAqi = 179;
let currentPm25 = 65.7;
let currentPm10 = 82.9;
let currentHourlyData = [];
let savedCities = [];
let comparisonCityA = null;
let comparisonCityB = null;

// -----------------------------------------------------------------------------
// Hardcoded Fallback Data for 10 Indian Cities (Offline Resilience)
// Used when the network is offline or if the Open-Meteo API fails.
// -----------------------------------------------------------------------------
const fallbackCities = {
  "Ludhiana": {
    name: "Ludhiana",
    region: "Punjab, India",
    lat: 30.9010,
    lon: 75.8573,
    aqi: 245,
    pm25: 118.4,
    pm10: 195.2,
    hourly: [210, 220, 235, 245, 255, 260, 250, 240, 225, 215, 205, 195, 190, 185, 180, 190, 205, 220, 235, 245, 250, 240, 230, 220]
  },
  "Jalandhar": {
    name: "Jalandhar",
    region: "Punjab, India",
    lat: 31.3260,
    lon: 75.5762,
    aqi: 215,
    pm25: 98.2,
    pm10: 170.5,
    hourly: [180, 190, 205, 215, 225, 230, 220, 210, 200, 190, 180, 175, 170, 168, 172, 180, 195, 205, 215, 220, 215, 205, 195, 185]
  },
  "Amritsar": {
    name: "Amritsar",
    region: "Punjab, India",
    lat: 31.6340,
    lon: 74.8723,
    aqi: 228,
    pm25: 106.1,
    pm10: 182.4,
    hourly: [195, 205, 218, 228, 235, 240, 232, 220, 210, 200, 190, 185, 180, 178, 182, 192, 205, 218, 228, 232, 225, 215, 205, 198]
  },
  "Delhi": {
    name: "Delhi",
    region: "NCT, India",
    lat: 28.6519,
    lon: 77.2315,
    aqi: 280,
    pm25: 145.0,
    pm10: 230.8,
    hourly: [251, 244, 237, 230, 223, 216, 210, 204, 199, 195, 192, 189, 186, 185, 184, 184, 183, 183, 182, 181, 179, 177, 174, 172]
  },
  "Kolkata": {
    name: "Kolkata",
    region: "West Bengal, India",
    lat: 22.5726,
    lon: 88.3639,
    aqi: 165,
    pm25: 78.5,
    pm10: 120.3,
    hourly: [140, 145, 150, 158, 165, 170, 168, 160, 152, 145, 138, 132, 130, 128, 135, 142, 150, 158, 165, 168, 162, 155, 148, 142]
  },
  "Mumbai": {
    name: "Mumbai",
    region: "Maharashtra, India",
    lat: 19.0760,
    lon: 72.8777,
    aqi: 132,
    pm25: 54.2,
    pm10: 95.0,
    hourly: [110, 115, 120, 128, 132, 135, 130, 125, 118, 112, 108, 105, 102, 100, 104, 110, 118, 126, 132, 135, 130, 122, 116, 112]
  },
  "Chennai": {
    name: "Chennai",
    region: "Tamil Nadu, India",
    lat: 13.0827,
    lon: 80.2707,
    aqi: 74,
    pm25: 24.1,
    pm10: 48.6,
    hourly: [62, 65, 68, 72, 74, 76, 73, 70, 68, 65, 62, 60, 58, 57, 60, 64, 68, 72, 74, 75, 72, 68, 65, 63]
  },
  "Bengaluru": {
    name: "Bengaluru",
    region: "Karnataka, India",
    lat: 12.9716,
    lon: 77.5946,
    aqi: 58,
    pm25: 18.3,
    pm10: 38.2,
    hourly: [50, 52, 55, 58, 60, 62, 59, 56, 54, 52, 49, 48, 46, 45, 48, 51, 54, 57, 58, 60, 57, 54, 52, 50]
  },
  "Kochi": {
    name: "Kochi",
    region: "Kerala, India",
    lat: 9.9312,
    lon: 76.2673,
    aqi: 42,
    pm25: 12.0,
    pm10: 26.5,
    hourly: [35, 36, 38, 40, 42, 44, 42, 40, 38, 36, 35, 34, 32, 31, 33, 35, 37, 40, 42, 43, 41, 39, 37, 36]
  },
  "Shimla": {
    name: "Shimla",
    region: "Himachal Pradesh, India",
    lat: 31.1048,
    lon: 77.1734,
    aqi: 32,
    pm25: 8.4,
    pm10: 18.1,
    hourly: [25, 26, 28, 30, 32, 34, 32, 30, 28, 26, 24, 23, 22, 21, 23, 25, 27, 30, 32, 33, 31, 29, 27, 26]
  }
};

// -----------------------------------------------------------------------------
// Function 1: getAqiCategory(aqi)
// Purpose: Returns the category name, CSS class, and color code for an AQI value
// based on standard US AQI breakpoints.
// -----------------------------------------------------------------------------
function getAqiCategory(aqi) {
  if (aqi <= 50) {
    return {
      name: "Good",
      className: "pill-good",
      color: "var(--aqi-good)",
      riskWord: "Low",
      summary: "Air quality is satisfactory and poses little or no risk to health."
    };
  } else if (aqi <= 100) {
    return {
      name: "Moderate",
      className: "pill-moderate",
      color: "var(--aqi-moderate)",
      riskWord: "Mild",
      summary: "Air quality is acceptable. Very sensitive individuals may experience minor irritation."
    };
  } else if (aqi <= 150) {
    return {
      name: "Unhealthy for Sensitive Groups",
      className: "pill-sensitive",
      color: "var(--aqi-sensitive)",
      riskWord: "Elevated",
      summary: "Children, elderly people, and those with respiratory issues should limit prolonged outdoor exertion."
    };
  } else if (aqi <= 200) {
    return {
      name: "Unhealthy",
      className: "pill-unhealthy",
      color: "var(--aqi-unhealthy)",
      riskWord: "High",
      summary: "Everyone may begin to experience health effects. Sensitive groups should avoid outdoor exertion."
    };
  } else if (aqi <= 300) {
    return {
      name: "Very Unhealthy",
      className: "pill-very-unhealthy",
      color: "var(--aqi-very-unhealthy)",
      riskWord: "Very High",
      summary: "Health alert: serious risk of respiratory symptoms and aggravation of heart or lung disease."
    };
  } else {
    return {
      name: "Hazardous",
      className: "pill-hazardous",
      color: "var(--aqi-hazardous)",
      riskWord: "Severe",
      summary: "Emergency conditions: Entire population is significantly likely to be affected. Stay indoors."
    };
  }
}

// -----------------------------------------------------------------------------
// Function 2: updateScene(aqi)
// Purpose: THE SKY EFFECT: Changes the visual atmospheric scene using pure CSS.
// - Background gradient goes from blue (clean) to orange-brown (smoggy) to dark (hazardous).
// - CSS sun circle fades and gets blurrier as AQI rises.
// - CSS haze overlay becomes more opaque as AQI rises.
// -----------------------------------------------------------------------------
function updateScene(aqi) {
  const skyScene = document.getElementById("sky-scene");
  const sunElement = document.getElementById("scene-sun");
  const hazeElement = document.getElementById("scene-haze");
  const sceneCaption = document.getElementById("scene-caption");
  const visibilityLabel = document.getElementById("visibility-label");

  if (!skyScene || !sunElement || !hazeElement) return;

  // Set visual parameters based on AQI level
  if (aqi <= 50) {
    // Clean, crisp blue sky with bright sharp sun
    skyScene.style.background = "linear-gradient(180deg, #38bdf8 0%, #7dd3fc 60%, #bae6fd 100%)";
    sunElement.style.opacity = "1";
    sunElement.style.filter = "blur(0px)";
    sunElement.style.background = "#fef08a";
    sunElement.style.boxShadow = "0 0 50px #fde047, 0 0 20px #fef9c3";
    hazeElement.style.opacity = "0";
    if (sceneCaption) sceneCaption.textContent = "Simulated Sky: Clear & Sunny";
    if (visibilityLabel) visibilityLabel.textContent = "Visibility: Excellent (> 10 km)";
  } else if (aqi <= 100) {
    // Moderate: slight pale yellow tint near horizon, mild sun blur
    skyScene.style.background = "linear-gradient(180deg, #60a5fa 0%, #93c5fd 50%, #fef08a 100%)";
    sunElement.style.opacity = "0.9";
    sunElement.style.filter = "blur(1px)";
    sunElement.style.background = "#fef08a";
    sunElement.style.boxShadow = "0 0 35px #fde047";
    hazeElement.style.opacity = "0.15";
    if (sceneCaption) sceneCaption.textContent = "Simulated Sky: Mild Haze";
    if (visibilityLabel) visibilityLabel.textContent = "Visibility: Good (~ 8 km)";
  } else if (aqi <= 150) {
    // Sensitive: warm dusty pale orange, noticeable haze
    skyScene.style.background = "linear-gradient(180deg, #94a3b8 0%, #cbd5e1 45%, #fed7aa 100%)";
    sunElement.style.opacity = "0.75";
    sunElement.style.filter = "blur(3px)";
    sunElement.style.background = "#fdba74";
    sunElement.style.boxShadow = "0 0 25px #fb923c";
    hazeElement.style.opacity = "0.35";
    if (sceneCaption) sceneCaption.textContent = "Simulated Sky: Moderate Smog";
    if (visibilityLabel) visibilityLabel.textContent = "Visibility: Moderate (~ 5 km)";
  } else if (aqi <= 200) {
    // Unhealthy: sepia / smoggy orange-gray sky, dim sun disc
    skyScene.style.background = "linear-gradient(180deg, #78716c 0%, #a8a29e 40%, #fdba74 100%)";
    sunElement.style.opacity = "0.55";
    sunElement.style.filter = "blur(6px)";
    sunElement.style.background = "#fb923c";
    sunElement.style.boxShadow = "0 0 15px rgba(251, 146, 60, 0.5)";
    hazeElement.style.opacity = "0.55";
    if (sceneCaption) sceneCaption.textContent = "Simulated Sky: Heavy Smog";
    if (visibilityLabel) visibilityLabel.textContent = "Visibility: Poor (~ 2-3 km)";
  } else if (aqi <= 300) {
    // Very Unhealthy: thick brownish-orange smog, weak pale sun
    skyScene.style.background = "linear-gradient(180deg, #57534e 0%, #78716c 40%, #c2410c 100%)";
    sunElement.style.opacity = "0.35";
    sunElement.style.filter = "blur(10px)";
    sunElement.style.background = "#ea580c";
    sunElement.style.boxShadow = "none";
    hazeElement.style.opacity = "0.75";
    if (sceneCaption) sceneCaption.textContent = "Simulated Sky: Very Dense Smog";
    if (visibilityLabel) visibilityLabel.textContent = "Visibility: Very Poor (< 1 km)";
  } else {
    // Hazardous: dark apocalyptic brownish-gray, sun nearly choked out
    skyScene.style.background = "linear-gradient(180deg, #292524 0%, #44403c 45%, #7c2d12 100%)";
    sunElement.style.opacity = "0.15";
    sunElement.style.filter = "blur(15px)";
    sunElement.style.background = "#b91c1c";
    sunElement.style.boxShadow = "none";
    hazeElement.style.opacity = "0.9";
    if (sceneCaption) sceneCaption.textContent = "Simulated Sky: Hazardous Smog Blanket";
    if (visibilityLabel) visibilityLabel.textContent = "Visibility: Severe Danger (< 500 m)";
  }
}

// -----------------------------------------------------------------------------
// Function 3: updateDashboard(city, aqi, pm25, pm10, hourlyArray, isFallback)
// Purpose: Updates all HTML elements on the dashboard with the latest data.
// -----------------------------------------------------------------------------
function updateDashboard(city, aqi, pm25, pm10, hourlyArray, isFallback) {
  currentCity = city;
  currentAqi = Math.round(aqi);
  currentPm25 = Number(pm25).toFixed(1);
  currentPm10 = Number(pm10).toFixed(1);
  currentHourlyData = hourlyArray || [];

  // Update text elements
  const cityNameElem = document.getElementById("current-city-name");
  const aqiNumElem = document.getElementById("aqi-number");
  const aqiBadgeCircle = document.getElementById("aqi-badge-circle");
  const aqiCategoryElem = document.getElementById("aqi-category");
  const aqiSummaryElem = document.getElementById("aqi-quick-summary");
  const pm25Elem = document.getElementById("pm25-val");
  const pm10Elem = document.getElementById("pm10-val");
  const timeElem = document.getElementById("current-time-text");
  const sourceBadge = document.getElementById("data-source-badge");

  if (cityNameElem) cityNameElem.textContent = currentCity;
  if (aqiNumElem) aqiNumElem.textContent = currentAqi;
  if (pm25Elem) pm25Elem.textContent = currentPm25;
  if (pm10Elem) pm10Elem.textContent = currentPm10;

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (timeElem) timeElem.textContent = `Updated today at ${timeString}`;

  // Update category and color
  const cat = getAqiCategory(currentAqi);
  if (aqiCategoryElem) {
    aqiCategoryElem.textContent = cat.name;
    aqiCategoryElem.className = `category-pill ${cat.className}`;
  }

  if (aqiBadgeCircle) {
    aqiBadgeCircle.style.setProperty("--aqi-bg", cat.color);
  }

  if (aqiSummaryElem) {
    aqiSummaryElem.textContent = cat.summary;
  }

  // Update live vs offline fallback badge
  if (sourceBadge) {
    if (isFallback) {
      sourceBadge.textContent = "Offline Fallback";
      sourceBadge.className = "badge badge-fallback";
    } else {
      sourceBadge.textContent = "Live API";
      sourceBadge.className = "badge badge-live";
    }
  }

  // Update the sky visual scene
  updateScene(currentAqi);

  // Render 24-hour forecast
  renderForecast(currentHourlyData);

  // Recalculate health advice if form has values
  calculateHealthAdvice();

  // Highlight active quick chip
  updateActiveCityChip(city);

  // Update star button state (saved vs not saved)
  updateFavButtonState();

  // Save last selected city to localStorage
  saveToLocalStorage("lastCity", currentCity);
}

// -----------------------------------------------------------------------------
// Function 4: renderForecast(hourlyArray)
// Purpose: Builds 24 hourly bars using a JavaScript loop (Unit V), colours them
// by category, and calculates the "best time" and "worst hour".
// -----------------------------------------------------------------------------
function renderForecast(hourlyArray) {
  const container = document.getElementById("forecast-bars-container");
  const bestValElem = document.getElementById("best-hour-val");
  const bestDescElem = document.getElementById("best-hour-desc");
  const worstValElem = document.getElementById("worst-hour-val");
  const worstDescElem = document.getElementById("worst-hour-desc");

  if (!container) return;
  container.innerHTML = "";

  // If no forecast array supplied, generate a smooth fallback curve from currentAqi
  let hoursData = hourlyArray;
  if (!hoursData || hoursData.length === 0) {
    hoursData = [];
    for (let i = 0; i < 24; i++) {
      // Simulate daytime dip and evening rise
      const variation = Math.sin((i - 6) / 24 * Math.PI * 2) * 25;
      hoursData.push(Math.max(15, Math.round(currentAqi + variation)));
    }
  }

  // Find max AQI to scale the visual bar heights (minimum scale 200, maximum 500)
  let maxAqi = Math.max(...hoursData, 200);

  // Variables to find best hour (between 6 AM and 9 PM: index 6 to index 21)
  let lowestDayAqi = Infinity;
  let bestHourIndex = 6;

  // Variables to find worst hour across whole 24 hours
  let highestAqi = -Infinity;
  let worstHourIndex = 0;

  // Loop through all 24 hours (Unit V: Loops and Dynamic Content Generation)
  for (let i = 0; i < 24; i++) {
    const aqi = Math.round(hoursData[i]);
    const cat = getAqiCategory(aqi);

    // Format hour label (e.g. 0 -> 12 AM, 6 -> 6 AM, 12 -> 12 PM, 15 -> 3 PM)
    const period = i >= 12 ? "PM" : "AM";
    const displayHour = i % 12 === 0 ? 12 : i % 12;
    const timeLabel = `${displayHour} ${period}`;

    // Track best hour between 6 AM (06:00) and 9 PM (21:00)
    if (i >= 6 && i <= 21) {
      if (aqi < lowestDayAqi) {
        lowestDayAqi = aqi;
        bestHourIndex = i;
      }
    }

    // Track overall worst hour
    if (aqi > highestAqi) {
      highestAqi = aqi;
      worstHourIndex = i;
    }

    // Calculate bar height percentage (clamped between 15% and 95%)
    const heightPercent = Math.min(95, Math.max(15, (aqi / maxAqi) * 90));

    // Create the column element
    const col = document.createElement("div");
    col.className = "hour-column";
    col.title = `${timeLabel}: AQI ${aqi} (${cat.name})`;

    col.innerHTML = `
      <div class="hour-bar-wrapper">
        <span class="hour-aqi-label">${aqi}</span>
        <div class="hour-bar" style="height: ${heightPercent}%; background-color: ${cat.color};"></div>
      </div>
      <span class="hour-time-label">${timeLabel}</span>
    `;

    container.appendChild(col);
  }

  // Update Best Time to step outside card
  const bestPeriod = bestHourIndex >= 12 ? "PM" : "AM";
  const bestDisplayHour = bestHourIndex % 12 === 0 ? 12 : bestHourIndex % 12;
  const bestTimeStr = `${bestDisplayHour}:00 ${bestPeriod}`;
  const bestCat = getAqiCategory(lowestDayAqi);

  if (bestValElem) {
    bestValElem.textContent = `${bestTimeStr} (AQI ${lowestDayAqi})`;
  }
  if (bestDescElem) {
    bestDescElem.textContent = `Cleanest daytime window (${bestCat.name}). Ideal for groceries or travel.`;
  }

  // Update Worst Hour card
  const worstPeriod = worstHourIndex >= 12 ? "PM" : "AM";
  const worstDisplayHour = worstHourIndex % 12 === 0 ? 12 : worstHourIndex % 12;
  const worstTimeStr = `${worstDisplayHour}:00 ${worstPeriod}`;
  const worstCat = getAqiCategory(highestAqi);

  if (worstValElem) {
    worstValElem.textContent = `${worstTimeStr} (AQI ${highestAqi})`;
  }
  if (worstDescElem) {
    worstDescElem.textContent = `Peak pollution level (${worstCat.name}). Keep windows closed and stay indoors.`;
  }
}

// -----------------------------------------------------------------------------
// Function 5: fetchCityData(cityName)
// Purpose: Uses Fetch API with async/await and try/catch. Calls Open-Meteo
// Geocoding and Air Quality APIs. Falls back to sample data if offline.
// -----------------------------------------------------------------------------
async function fetchCityData(cityName) {
  const statusBanner = document.getElementById("status-banner");
  const statusText = document.getElementById("status-text");

  // Show loading message
  if (statusBanner && statusText) {
    statusBanner.className = "status-banner";
    statusText.textContent = `Finding your air for ${cityName}...`;
  }

  try {
    // 1. Geocoding API: lookup latitude and longitude by city name
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`;
    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error(`Geocoding HTTP error: ${geoResponse.status}`);
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`City "${cityName}" not found.`);
    }

    const firstResult = geoData.results[0];
    const lat = firstResult.latitude;
    const lon = firstResult.longitude;
    const resolvedName = firstResult.name;

    // 2. Air Quality API: lookup AQI, PM2.5, PM10, and hourly forecast
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5&hourly=us_aqi&forecast_days=1&timezone=auto`;
    const aqiResponse = await fetch(aqiUrl);

    if (!aqiResponse.ok) {
      throw new Error(`Air Quality HTTP error: ${aqiResponse.status}`);
    }

    const aqiData = await aqiResponse.json();

    if (!aqiData.current) {
      throw new Error("No current air quality data returned.");
    }

    const liveAqi = aqiData.current.us_aqi || 50;
    const livePm25 = aqiData.current.pm2_5 || 15.0;
    const livePm10 = aqiData.current.pm10 || 25.0;
    const hourlyAqi = aqiData.hourly && aqiData.hourly.us_aqi ? aqiData.hourly.us_aqi : [];

    // Success! Update dashboard with live data
    updateDashboard(resolvedName, liveAqi, livePm25, livePm10, hourlyAqi, false);

    if (statusBanner && statusText) {
      statusBanner.className = "status-banner";
      statusText.textContent = `Showing live air quality for ${resolvedName}`;
      setTimeout(() => {
        statusText.textContent = `AirScape: Live connection active.`;
      }, 3500);
    }
  } catch (error) {
    // Fallback mode if offline or API fails
    console.warn("API request failed or offline:", error.message);
    loadFallbackCity(cityName);
  }
}

// -----------------------------------------------------------------------------
// Function 6: loadFallbackCity(cityName)
// Purpose: Loads hardcoded sample data for one of the 10 Indian cities so the
// web app never stays blank.
// -----------------------------------------------------------------------------
function loadFallbackCity(cityName) {
  const statusBanner = document.getElementById("status-banner");
  const statusText = document.getElementById("status-text");

  // Normalize city search for match in fallback database
  let matchedKey = null;
  const cleanInput = cityName.trim().toLowerCase();

  for (const key in fallbackCities) {
    if (key.toLowerCase() === cleanInput || key.toLowerCase().includes(cleanInput)) {
      matchedKey = key;
      break;
    }
  }

  // Default to Delhi if input not among the 10 cities
  if (!matchedKey) {
    matchedKey = "Delhi";
  }

  const sample = fallbackCities[matchedKey];
  updateDashboard(sample.name, sample.aqi, sample.pm25, sample.pm10, sample.hourly, true);

  if (statusBanner && statusText) {
    statusBanner.className = "status-banner offline";
    statusText.textContent = `Offline or API unreachable: Showing cached sample data for ${sample.name}.`;
  }
}

// -----------------------------------------------------------------------------
// Function 7: fetchByCoordinates(lat, lon)
// Purpose: Geolocation API helper to fetch live air quality at user's GPS coords.
// -----------------------------------------------------------------------------
async function fetchByCoordinates(lat, lon) {
  const statusBanner = document.getElementById("status-banner");
  const statusText = document.getElementById("status-text");

  if (statusBanner && statusText) {
    statusBanner.className = "status-banner";
    statusText.textContent = "Fetching air quality at your GPS location...";
  }

  try {
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5&hourly=us_aqi&forecast_days=1&timezone=auto`;
    const response = await fetch(aqiUrl);
    if (!response.ok) throw new Error("AQI fetch failed");

    const data = await response.json();
    const liveAqi = data.current.us_aqi || 60;
    const livePm25 = data.current.pm2_5 || 20;
    const livePm10 = data.current.pm10 || 35;
    const hourly = data.hourly ? data.hourly.us_aqi : [];

    updateDashboard("Your Current Location", liveAqi, livePm25, livePm10, hourly, false);

    if (statusBanner && statusText) {
      statusText.textContent = "Air quality detected at your location.";
    }
  } catch (err) {
    console.warn("Geolocation air quality fetch failed:", err);
    loadFallbackCity("Delhi");
  }
}

// -----------------------------------------------------------------------------
// Function 8: setupGeolocation()
// Purpose: Wires the "Use My Location" button with browser Geolocation API.
// -----------------------------------------------------------------------------
function setupGeolocation() {
  const geoBtn = document.getElementById("geo-btn");
  if (!geoBtn) return;

  geoBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    geoBtn.disabled = true;
    geoBtn.textContent = "Detecting GPS...";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchByCoordinates(lat, lon);
        geoBtn.disabled = false;
        geoBtn.innerHTML = `
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
          Use My Location
        `;
      },
      (error) => {
        console.warn("Geolocation error code:", error.code, error.message);
        alert("Unable to retrieve your location. Showing default city (Delhi).");
        loadFallbackCity("Delhi");
        geoBtn.disabled = false;
        geoBtn.innerHTML = `
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
          Use My Location
        `;
      },
      { timeout: 8000 }
    );
  });
}

// -----------------------------------------------------------------------------
// Function 9: setupQuickCityButtons()
// Purpose: Renders quick chips for all 10 fallback Indian cities.
// -----------------------------------------------------------------------------
function setupQuickCityButtons() {
  const container = document.getElementById("quick-cities-list");
  if (!container) return;
  container.innerHTML = "";

  const cityList = Object.keys(fallbackCities);
  for (let i = 0; i < cityList.length; i++) {
    const city = cityList[i];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "city-chip";
    button.textContent = city;
    button.dataset.city = city;

    button.addEventListener("click", () => {
      fetchCityData(city);
    });

    container.appendChild(button);
  }
}

// -----------------------------------------------------------------------------
// Function 10: updateActiveCityChip(cityName)
// Purpose: Marks the currently selected city button as active.
// -----------------------------------------------------------------------------
function updateActiveCityChip(cityName) {
  const chips = document.querySelectorAll(".city-chip");
  chips.forEach((chip) => {
    if (chip.dataset.city && chip.dataset.city.toLowerCase() === cityName.toLowerCase()) {
      chip.classList.add("active");
    } else {
      chip.classList.remove("active");
    }
  });
}

// -----------------------------------------------------------------------------
// Function 11: setupSearchForm()
// Purpose: Handles text search input submission and validation.
// -----------------------------------------------------------------------------
function setupSearchForm() {
  const searchForm = document.getElementById("search-form");
  const cityInput = document.getElementById("city-input");

  if (!searchForm || !cityInput) return;

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = cityInput.value.trim();
    if (query.length > 0) {
      fetchCityData(query);
      cityInput.value = "";
    }
  });
}

// -----------------------------------------------------------------------------
// Function 12: Web Storage Helpers (localStorage wrapped in try/catch)
// -----------------------------------------------------------------------------
function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("localStorage write failed:", e);
  }
}

function loadFromLocalStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("localStorage read failed:", e);
  }
  return defaultValue;
}

// -----------------------------------------------------------------------------
// Function 13: setupFavorites()
// Purpose: Allows user to star/save cities to localStorage and recall them easily.
// -----------------------------------------------------------------------------
function setupFavorites() {
  const favBtn = document.getElementById("fav-btn");
  savedCities = loadFromLocalStorage("savedCities", ["Delhi", "Amritsar"]);

  renderFavoritesList();
  updateFavButtonState();

  if (!favBtn) return;
  favBtn.addEventListener("click", () => {
    const city = currentCity;
    const index = savedCities.indexOf(city);

    if (index === -1) {
      // Add to favorites
      savedCities.push(city);
    } else {
      // Remove from favorites
      savedCities.splice(index, 1);
    }

    saveToLocalStorage("savedCities", savedCities);
    renderFavoritesList();
    updateFavButtonState();
  });
}

function updateFavButtonState() {
  const favBtnText = document.getElementById("fav-btn-text");
  const favIcon = document.getElementById("fav-icon");
  if (!favBtnText || !favIcon) return;

  if (savedCities.includes(currentCity)) {
    favBtnText.textContent = "Saved";
    favIcon.textContent = "⭐";
  } else {
    favBtnText.textContent = "Save City";
    favIcon.textContent = "☆";
  }
}

function renderFavoritesList() {
  const favContainer = document.getElementById("favorites-list");
  if (!favContainer) return;
  favContainer.innerHTML = "";

  if (savedCities.length === 0) {
    favContainer.innerHTML = `<span class="empty-fav-msg">No saved cities yet. Click "Save City" above!</span>`;
    return;
  }

  for (let i = 0; i < savedCities.length; i++) {
    const cityName = savedCities[i];
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "fav-chip";
    chip.innerHTML = `⭐ ${cityName}`;
    chip.addEventListener("click", () => {
      fetchCityData(cityName);
    });
    favContainer.appendChild(chip);
  }
}

// -----------------------------------------------------------------------------
// Function 14: setupHealthProfileForm()
// Purpose: Validates form inputs with Regular Expressions (Regex) and Range
// checks, then triggers the advice engine.
// -----------------------------------------------------------------------------
function setupHealthProfileForm() {
  const form = document.getElementById("profile-form");
  const nameInput = document.getElementById("profile-name");
  const ageInput = document.getElementById("profile-age");
  const hoursSlider = document.getElementById("profile-hours");
  const hoursDisplay = document.getElementById("hours-display");
  const nameError = document.getElementById("name-error");
  const ageError = document.getElementById("age-error");

  if (!form || !hoursSlider || !hoursDisplay) return;

  // Live slider number feedback
  hoursSlider.addEventListener("input", () => {
    hoursDisplay.textContent = `${hoursSlider.value} hours`;
  });

  // Load saved profile values from localStorage
  const savedProfile = loadFromLocalStorage("userProfile", null);
  if (savedProfile) {
    if (nameInput && savedProfile.nickname) nameInput.value = savedProfile.nickname;
    if (ageInput && savedProfile.age) ageInput.value = savedProfile.age;
    if (savedProfile.hours) {
      hoursSlider.value = savedProfile.hours;
      hoursDisplay.textContent = `${savedProfile.hours} hours`;
    }
    if (savedProfile.sensitive) {
      const radio = document.querySelector(`input[name="sensitivity"][value="${savedProfile.sensitive}"]`);
      if (radio) radio.checked = true;
    }
  }

  // Handle Form Submission with Validation
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset error messages
    if (nameError) nameError.textContent = "";
    if (ageError) ageError.textContent = "";

    const nickname = nameInput.value.trim();
    const ageValue = parseInt(ageInput.value, 10);

    // Regex Validation for Nickname (Unit V: Regular Expressions)
    // Optional, but if provided must only contain letters/spaces, 2 to 20 chars
    const nameRegex = /^[a-zA-Z\s]{2,20}$/;
    if (nickname.length > 0 && !nameRegex.test(nickname)) {
      if (nameError) nameError.textContent = "Nickname must be 2-20 characters (letters only).";
      isValid = false;
    }

    // Number Range Validation for Age
    if (isNaN(ageValue) || ageValue < 1 || ageValue > 120) {
      if (ageError) ageError.textContent = "Please enter a valid age between 1 and 120.";
      isValid = false;
    }

    if (!isValid) return;

    // Get breathing sensitivity radio choice
    const sensitivityChoice = document.querySelector('input[name="sensitivity"]:checked').value;

    // Save profile to localStorage
    const profileData = {
      nickname: nickname,
      age: ageValue,
      hours: hoursSlider.value,
      sensitive: sensitivityChoice
    };
    saveToLocalStorage("userProfile", profileData);

    // Run Advice Engine
    calculateHealthAdvice();
  });
}

// -----------------------------------------------------------------------------
// Function 15: calculateHealthAdvice()
// Purpose: Plain if/else Advice Engine.
// - Effective AQI = real AQI * 1.35 if asthma/allergies, and * 1.2 if age < 12 or 60+.
// - Pick risk level: Low, Mild, Elevated, High, Very High, Severe.
// - Gives actionable points based on risk, hours outdoors, and forecast best hour.
// -----------------------------------------------------------------------------
function calculateHealthAdvice() {
  const nameInput = document.getElementById("profile-name");
  const ageInput = document.getElementById("profile-age");
  const hoursSlider = document.getElementById("profile-hours");
  const userGreeting = document.getElementById("user-greeting");
  const effectiveAqiElem = document.getElementById("effective-aqi-val");
  const riskBadge = document.getElementById("risk-level-badge");
  const effectiveExplanation = document.getElementById("effective-explanation");
  const adviceList = document.getElementById("advice-list");

  if (!effectiveAqiElem || !riskBadge || !adviceList) return;

  // Read inputs or use sensible defaults
  const nickname = nameInput && nameInput.value.trim().length > 0 ? nameInput.value.trim() : "Guest";
  const age = ageInput && !isNaN(parseInt(ageInput.value, 10)) ? parseInt(ageInput.value, 10) : 21;
  const hoursOutdoors = hoursSlider ? parseFloat(hoursSlider.value) : 2;
  const sensitivityRadio = document.querySelector('input[name="sensitivity"]:checked');
  const isSensitive = sensitivityRadio ? sensitivityRadio.value === "yes" : false;

  if (userGreeting) {
    userGreeting.textContent = `For ${nickname} (${age} yrs)`;
  }

  // 1. Calculate Multiplier & Effective AQI
  let multiplier = 1.0;
  let multiplierReasons = [];

  if (isSensitive) {
    multiplier *= 1.35;
    multiplierReasons.push("+35% respiratory sensitivity");
  }

  if (age < 12 || age >= 60) {
    multiplier *= 1.2;
    multiplierReasons.push("+20% age risk factor");
  }

  const effectiveAqi = Math.round(currentAqi * multiplier);
  effectiveAqiElem.textContent = effectiveAqi;

  // 2. Determine Risk Level based on Effective AQI
  let riskLevel = "";
  let riskBadgeClass = "";

  if (effectiveAqi <= 50) {
    riskLevel = "Low Risk";
    riskBadgeClass = "badge-low";
  } else if (effectiveAqi <= 100) {
    riskLevel = "Mild Risk";
    riskBadgeClass = "badge-mild";
  } else if (effectiveAqi <= 150) {
    riskLevel = "Elevated Risk";
    riskBadgeClass = "badge-elevated";
  } else if (effectiveAqi <= 200) {
    riskLevel = "High Risk";
    riskBadgeClass = "badge-high";
  } else if (effectiveAqi <= 300) {
    riskLevel = "Very High Risk";
    riskBadgeClass = "badge-very-high";
  } else {
    riskLevel = "Severe Risk";
    riskBadgeClass = "badge-severe";
  }

  riskBadge.textContent = riskLevel;
  riskBadge.className = `risk-badge ${riskBadgeClass}`;

  // Explanation text
  if (multiplierReasons.length > 0) {
    effectiveExplanation.textContent = `Base AQI ${currentAqi} scaled to ${effectiveAqi} due to ${multiplierReasons.join(" & ")}.`;
  } else {
    effectiveExplanation.textContent = `Standard exposure calculation based on base AQI of ${currentAqi}.`;
  }

  // 3. Generate Tailored Advice Points (Plain if/else logic)
  const adviceItems = [];

  // Advice based on risk level
  if (effectiveAqi <= 50) {
    adviceItems.push({
      icon: "🌿",
      text: "Air quality is ideal. You can safely jog, commute, and enjoy long outdoor sessions."
    });
    adviceItems.push({
      icon: "🪟",
      text: "Open home and office windows for natural ventilation and fresh airflow."
    });
  } else if (effectiveAqi <= 100) {
    adviceItems.push({
      icon: "🌤️",
      text: "Air quality is acceptable for most people. Outdoor exercise is safe."
    });
    if (isSensitive) {
      adviceItems.push({
        icon: "👀",
        text: "Unusually sensitive individuals should monitor for throat or eye irritation."
      });
    }
  } else if (effectiveAqi <= 150) {
    adviceItems.push({
      icon: "⏱️",
      text: "Limit prolonged outdoor physical exertion. Take frequent indoor recovery breaks."
    });
    adviceItems.push({
      icon: "😷",
      text: "Consider a lightweight filtration mask if traveling in heavy traffic or dusty roadside zones."
    });
  } else if (effectiveAqi <= 200) {
    adviceItems.push({
      icon: "😷",
      text: "Wear an <strong>N95 or FFP2 respirator mask</strong> whenever stepping outside."
    });
    adviceItems.push({
      icon: "🚪",
      text: "Keep exterior windows and balcony doors shut to prevent outdoor particulate ingress."
    });
    adviceItems.push({
      icon: "🏋️",
      text: "Move high-intensity workouts and cardio indoors."
    });
  } else if (effectiveAqi <= 300) {
    adviceItems.push({
      icon: "🛑",
      text: "<strong>Avoid unnecessary outdoor travel.</strong> Particulate levels are hazardous."
    });
    adviceItems.push({
      icon: "😷",
      text: "An N95 mask is strictly necessary for any outdoor exposure."
    });
    adviceItems.push({
      icon: "🌀",
      text: "Run an indoor HEPA air purifier and wipe surfaces with a damp cloth instead of dry sweeping."
    });
  } else {
    adviceItems.push({
      icon: "🚨",
      text: "<strong>Emergency Air Warning:</strong> Hazardous atmospheric pollution. Seal all room gaps."
    });
    adviceItems.push({
      icon: "🏠",
      text: "Stay strictly indoors. Do not exercise even indoors if air infiltration is noticeable."
    });
  }

  // Advice based on hours spent outdoors
  if (hoursOutdoors >= 3 && effectiveAqi > 100) {
    adviceItems.push({
      icon: "⏳",
      text: `You have planned <strong>${hoursOutdoors} hours outdoors</strong> today. Your cumulative toxic dose will be high—try to schedule remote tasks or take indoor pauses every 45 minutes.`
    });
  } else if (hoursOutdoors <= 1) {
    adviceItems.push({
      icon: "🛡️",
      text: "Brief outdoor exposure (< 1 hour) keeps your cumulative pollution intake relatively minimal."
    });
  }

  // Advice based on forecast best hour
  const bestHourText = document.getElementById("best-hour-val");
  if (bestHourText && bestHourText.textContent && !bestHourText.textContent.includes("Calculating")) {
    adviceItems.push({
      icon: "⏰",
      text: `If you must run errands, schedule them around <strong>${bestHourText.textContent}</strong> when pollution is lowest.`
    });
  }

  // Advice for sensitive users
  if (isSensitive) {
    adviceItems.push({
      icon: "💊",
      text: "Keep your prescribed <strong>inhalers and allergy medicines</strong> within immediate reach."
    });
  }

  // Render advice checklist
  adviceList.innerHTML = "";
  for (let i = 0; i < adviceItems.length; i++) {
    const item = adviceItems[i];
    const li = document.createElement("li");
    li.className = "advice-item";
    li.innerHTML = `
      <span class="advice-bullet">${item.icon}</span>
      <span>${item.text}</span>
    `;
    adviceList.appendChild(li);
  }
}

// -----------------------------------------------------------------------------
// Function 16: setupDragAndDropCompare()
// Purpose: HTML5 Drag and Drop API (Unit V). Allows dragging city chips into
// two dropzones, and also supports mobile dropdown selectors as a fallback.
// -----------------------------------------------------------------------------
function setupDragAndDropCompare() {
  const pool = document.getElementById("drag-source-pool");
  const dropzoneA = document.getElementById("dropzone-a");
  const dropzoneB = document.getElementById("dropzone-b");
  const selectA = document.getElementById("select-city-a");
  const selectB = document.getElementById("select-city-b");

  if (!pool || !dropzoneA || !dropzoneB) return;

  pool.innerHTML = "";
  const cityKeys = Object.keys(fallbackCities);

  // Populate Draggable Chips in the Pool
  for (let i = 0; i < cityKeys.length; i++) {
    const cityName = cityKeys[i];
    const chip = document.createElement("div");
    chip.className = "drag-chip";
    chip.draggable = true;
    chip.textContent = cityName;
    chip.dataset.city = cityName;

    // Drag Start Event
    chip.addEventListener("dragstart", (e) => {
      chip.classList.add("dragging");
      e.dataTransfer.setData("text/plain", cityName);
      e.dataTransfer.effectAllowed = "copy";
    });

    // Drag End Event
    chip.addEventListener("dragend", () => {
      chip.classList.remove("dragging");
    });

    pool.appendChild(chip);

    // Also populate mobile select options
    if (selectA) {
      const optA = document.createElement("option");
      optA.value = cityName;
      optA.textContent = cityName;
      selectA.appendChild(optA);
    }
    if (selectB) {
      const optB = document.createElement("option");
      optB.value = cityName;
      optB.textContent = cityName;
      selectB.appendChild(optB);
    }
  }

  // Setup Dropzone Event Listeners
  [dropzoneA, dropzoneB].forEach((dropzone) => {
    // Drag Over
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      dropzone.classList.add("drag-over");
    });

    // Drag Leave
    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("drag-over");
    });

    // Drop
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("drag-over");
      const droppedCity = e.dataTransfer.getData("text/plain");
      const slot = dropzone.dataset.slot;

      if (slot === "A") {
        setComparisonCity("A", droppedCity);
        if (selectA) selectA.value = droppedCity;
      } else {
        setComparisonCity("B", droppedCity);
        if (selectB) selectB.value = droppedCity;
      }
    });
  });

  // Mobile Select Dropdown Handlers
  if (selectA) {
    selectA.addEventListener("change", (e) => {
      if (e.target.value) setComparisonCity("A", e.target.value);
    });
  }
  if (selectB) {
    selectB.addEventListener("change", (e) => {
      if (e.target.value) setComparisonCity("B", e.target.value);
    });
  }

  // Pre-populate with Delhi vs Shimla as an impressive starter example!
  setComparisonCity("A", "Delhi");
  setComparisonCity("B", "Shimla");
  if (selectA) selectA.value = "Delhi";
  if (selectB) selectB.value = "Shimla";
}

// -----------------------------------------------------------------------------
// Function 17: setComparisonCity(slot, cityName)
// Purpose: Sets comparison city in slot A or B and triggers verdict render.
// -----------------------------------------------------------------------------
function setComparisonCity(slot, cityName) {
  const cityData = fallbackCities[cityName];
  if (!cityData) return;

  const contentElem = document.getElementById(slot === "A" ? "content-city-a" : "content-city-b");
  const cat = getAqiCategory(cityData.aqi);

  if (contentElem) {
    contentElem.innerHTML = `
      <div class="city-compare-card">
        <h4 class="city-compare-name">${cityData.name}</h4>
        <div class="city-compare-aqi" style="color: ${cat.color}">${cityData.aqi}</div>
        <span class="city-compare-pill" style="background-color: ${cat.color}">${cat.name}</span>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 6px;">
          PM2.5: ${cityData.pm25} µg/m³
        </div>
      </div>
    `;
  }

  if (slot === "A") {
    comparisonCityA = cityData;
  } else {
    comparisonCityB = cityData;
  }

  renderComparisonVerdict();
}

// -----------------------------------------------------------------------------
// Function 18: renderComparisonVerdict()
// Purpose: Calculates which city has worse air and by how much, and draws
// a visual comparison bar.
// -----------------------------------------------------------------------------
function renderComparisonVerdict() {
  const resultContainer = document.getElementById("comparison-result");
  if (!resultContainer) return;

  if (!comparisonCityA || !comparisonCityB) {
    resultContainer.innerHTML = `<div class="comparison-placeholder">Select or drag two cities above to view an instant side-by-side air quality analysis.</div>`;
    return;
  }

  const diff = Math.abs(comparisonCityA.aqi - comparisonCityB.aqi);
  let worseCity = null;
  let cleanerCity = null;

  if (comparisonCityA.aqi > comparisonCityB.aqi) {
    worseCity = comparisonCityA;
    cleanerCity = comparisonCityB;
  } else if (comparisonCityB.aqi > comparisonCityA.aqi) {
    worseCity = comparisonCityB;
    cleanerCity = comparisonCityA;
  }

  // Calculate ratio
  const ratio = cleanerCity && cleanerCity.aqi > 0 ? (worseCity.aqi / cleanerCity.aqi).toFixed(1) : 1;

  // Calculate percentage width for visual bar
  const total = comparisonCityA.aqi + comparisonCityB.aqi;
  const percentA = total > 0 ? Math.round((comparisonCityA.aqi / total) * 100) : 50;
  const percentB = 100 - percentA;

  let verdictMarkup = "";

  if (worseCity === null) {
    verdictMarkup = `
      <div class="comparison-analysis">
        <h4 class="verdict-title">Identical Air Quality!</h4>
        <p class="verdict-text">Both ${comparisonCityA.name} and ${comparisonCityB.name} have an identical AQI of ${comparisonCityA.aqi}.</p>
      </div>
    `;
  } else {
    verdictMarkup = `
      <div class="comparison-analysis">
        <h4 class="verdict-title">Comparison Result:</h4>
        <p class="verdict-text">
          <strong>${worseCity.name}'s air is worse than ${cleanerCity.name} by ${diff} AQI points</strong> (${ratio}x higher pollution).
        </p>

        <!-- Relative Comparison Proportion Bar -->
        <div class="verdict-bar-wrapper" title="${comparisonCityA.name}: ${percentA}% vs ${comparisonCityB.name}: ${percentB}%">
          <div class="verdict-bar-a" style="width: ${percentA}%;"></div>
          <div class="verdict-bar-b" style="width: ${percentB}%;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-top: 4px;">
          <span>${comparisonCityA.name} (${comparisonCityA.aqi} AQI)</span>
          <span>${comparisonCityB.name} (${comparisonCityB.aqi} AQI)</span>
        </div>
      </div>
    `;
  }

  resultContainer.innerHTML = verdictMarkup;
}

// -----------------------------------------------------------------------------
// Function 19: setupNavigation()
// Purpose: Handles mobile menu toggle and highlights active section on scroll.
// -----------------------------------------------------------------------------
function setupNavigation() {
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");

  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navbar.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when a link is clicked on mobile
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navbar.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Highlight active link based on scroll position
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    let currentId = "home";

    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 120;
      if (window.scrollY >= secTop) {
        currentId = sec.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  });
}

// -----------------------------------------------------------------------------
// Function 20: initializeApp()
// Purpose: Entry point. Runs on DOMContentLoaded to initialize all modules.
// -----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupQuickCityButtons();
  setupSearchForm();
  setupGeolocation();
  setupFavorites();
  setupHealthProfileForm();
  setupDragAndDropCompare();

  // Load last searched city or default to Delhi
  const lastCity = loadFromLocalStorage("lastCity", "Delhi");
  fetchCityData(lastCity);
});
