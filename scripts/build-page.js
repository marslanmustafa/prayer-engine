const fs = require('fs');

const bundleCode = fs.readFileSync('./dist/index.global.js', 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Prayer Engine | Universal Islamic Prayer Times, Qibla & Hijri Moon-Sighting</title>
<meta name="description" content="High-precision universal Islamic prayer times, Dahwa-e-Kubra (Islamic midday), Makrooh Zawaal window, Qibla compass bearing, and Hijri moon-sighting engine with multi-school support.">
<meta name="keywords" content="prayer times, namaz timings, islamic prayer times, dahwa-e-kubra, makrooh midday, zawaal, qibla direction, hijri calendar, moon sighting, hanafi, shafi, adhan, azan">
<meta name="author" content="Arslan Mustafa">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#15803d">
<link rel="canonical" href="https://prayer-engine.vercel.app/">
<meta name="google-site-verification" content="kPCp4JALp2EwViJ-ulaoqJyfdOT5k9icFEEjUmuMstM">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://prayer-engine.vercel.app/">
<meta property="og:title" content="Prayer Engine | Universal Islamic Prayer Times & Hijri Calendar">
<meta property="og:description" content="Calculate high-precision prayer times, Dahwa-e-Kubra, Makrooh Midday window, Qibla bearing, and Hijri moon-sighting dates with multi-school support.">
<meta property="og:site_name" content="Prayer Engine">
<meta property="og:locale" content="en_US">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://prayer-engine.vercel.app/">
<meta name="twitter:title" content="Prayer Engine | Universal Islamic Prayer Times & Hijri Calendar">
<meta name="twitter:description" content="High-precision universal Islamic prayer times, Dahwa-e-Kubra, Qibla compass bearing, and Hijri moon-sighting engine.">

<!-- Structured Data (JSON-LD) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Prayer Engine",
      "url": "https://prayer-engine.vercel.app/",
      "description": "Universal Islamic prayer times, Dahwa-e-Kubra, Qibla compass, and Hijri moon-sighting engine with multi-school support.",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript",
      "softwareVersion": "1.0.0"
    },
    {
      "@type": "SoftwareSourceCode",
      "name": "@marslanmustafa/prayer-engine",
      "codeRepository": "https://github.com/marslanmustafa/prayer-engine",
      "programmingLanguage": "TypeScript",
      "runtimePlatform": "Node.js, Browser, React Native"
    }
  ]
}
</script>

<style>
:root {
  --primary: #15803d;
  --primary-dark: #166534;
  --primary-light: #f0fdf4;
  --primary-border: #bbf7d0;
  --bg: #f8fafc;
  --card: #ffffff;
  --text: #0f172a;
  --text-muted: #475569;
  --border: #e2e8f0;
  --danger: #b91c1c;
  --danger-bg: #fef2f2;
  --danger-border: #fecaca;
  --font-main: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-urdu: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Segoe UI', Tahoma, sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--text);
  font: 400 15px/1.5 var(--font-main);
  min-height: 100vh;
  padding: 16px 14px 40px;
}

.container {
  max-width: 920px;
  margin: 0 auto;
}

/* Header */
header {
  background: var(--primary);
  color: #ffffff;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.brand-title {
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-sub {
  font-size: 13px;
  opacity: 0.9;
  margin-top: 2px;
}

.btn-header {
  background: #ffffff;
  color: var(--primary-dark);
  border: none;
  font: 600 13px var(--font-main);
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.15s;
}

.btn-header:hover { opacity: 0.92; }

/* Navigation Tabs */
.nav-tabs {
  display: flex;
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 16px;
  gap: 4px;
}

.tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font: 600 14px var(--font-main);
  padding: 9px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s;
}

.tab-btn.active {
  background: var(--primary);
  color: #ffffff;
}

/* City Presets Bar */
.city-bar {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 6px;
  margin-bottom: 14px;
  scrollbar-width: none;
}
.city-bar::-webkit-scrollbar { display: none; }

.city-chip {
  background: #ffffff;
  border: 1px solid var(--border);
  color: var(--text);
  font: 500 13px var(--font-main);
  padding: 6px 13px;
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.city-chip:hover { border-color: var(--primary); }
.city-chip.active {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary-dark);
  font-weight: 700;
}

/* Hero Next Prayer & Hijri Card */
.hero-card {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.hijri-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.hijri-ur {
  font-family: var(--font-urdu);
  font-size: 19px;
  color: var(--primary-dark);
  direction: rtl;
}

.hijri-en {
  font-size: 13px;
  color: var(--text-muted);
}

.moon-adjust {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 12px;
}

.btn-adj {
  background: #ffffff;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 2px 7px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
}

.btn-adj.active {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}

.badge-gyarween {
  background: #fef08a;
  color: #854d0e;
  border: 1px solid #facc15;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 700;
}

/* Next Prayer Box */
.next-box {
  background: var(--primary-light);
  border: 1px solid var(--primary-border);
  border-radius: 8px;
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.next-label {
  font-size: 12px;
  text-transform: uppercase;
  color: var(--primary-dark);
  font-weight: 700;
  letter-spacing: 0.04em;
}

.next-name {
  font-size: 22px;
  font-weight: 800;
  color: var(--primary-dark);
}

.next-timer {
  font-size: 30px;
  font-weight: 800;
  color: var(--primary-dark);
  font-variant-numeric: tabular-nums;
}

/* Makrooh Midday Alert */
.alert-makrooh {
  background: var(--danger-bg);
  border: 1px solid var(--danger-border);
  color: var(--danger);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
}

/* Quick Controls Row */
.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}

.btn-preset {
  background: #ffffff;
  border: 1px solid var(--primary);
  color: var(--primary-dark);
  font: 700 13px var(--font-main);
  padding: 7px 14px;
  border-radius: 20px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.btn-preset:hover { background: var(--primary-light); }

.toggle-group {
  display: inline-flex;
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 2px;
}

.btn-toggle {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font: 600 12.5px var(--font-main);
  padding: 5px 11px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-toggle.active {
  background: var(--primary-light);
  color: var(--primary-dark);
  font-weight: 700;
}

/* Prayer Times Table */
.table-card {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}

tr:last-child { border-bottom: none; }

td {
  padding: 12px 18px;
}

td:first-child {
  font-weight: 600;
}

td.td-urdu {
  font-family: var(--font-urdu);
  font-size: 15px;
  color: var(--primary-dark);
  direction: rtl;
  text-align: right;
  width: 120px;
}

td.td-time {
  text-align: right;
  font-weight: 700;
  font-size: 18px;
  font-variant-numeric: tabular-nums;
  color: var(--primary-dark);
  width: 130px;
}

tr.row-active {
  background: var(--primary-light);
}

tr.row-active td:first-child {
  color: var(--primary-dark);
  font-weight: 800;
}

tr.row-special {
  background: #fafaf9;
}

tr.row-makrooh td {
  color: var(--danger);
}

/* Info Strip */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

@media (max-width: 600px) {
  .info-grid { grid-template-columns: 1fr; }
}

.info-box {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 13px;
  color: var(--text-muted);
}

.info-val {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-dark);
}

/* Collapsible Settings */
.advanced-card {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 10px;
  margin-bottom: 16px;
  overflow: hidden;
}

.adv-toggle {
  width: 100%;
  background: transparent;
  border: none;
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font: 700 13.5px var(--font-main);
  color: var(--text);
  cursor: pointer;
}

.adv-toggle:hover { background: var(--bg); }

.adv-body {
  padding: 16px 18px;
  border-top: 1px solid var(--border);
  background: #fafaf9;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: #ffffff;
  font: inherit;
  font-size: 13px;
}

.ihtiat-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
  margin-top: 6px;
}

@media (max-width: 550px) {
  .ihtiat-row { grid-template-columns: repeat(3, 1fr); }
}

.ihtiat-cell {
  text-align: center;
}

.ihtiat-cell span {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
  margin-bottom: 2px;
}

.ihtiat-cell input {
  width: 100%;
  text-align: center;
  padding: 5px 2px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 13px;
}

/* Guide Page Styles */
.guide-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guide-box {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px;
}

.guide-box h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.guide-box p {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
}

.code-container {
  background: #0f172a;
  color: #38bdf8;
  border-radius: 8px;
  overflow: hidden;
  margin: 10px 0;
}

.code-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1e293b;
  padding: 6px 12px;
  font-size: 11px;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
}

.btn-copy {
  background: #334155;
  color: #f8fafc;
  border: none;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
}
.btn-copy:hover { background: #475569; }

pre {
  margin: 0;
  padding: 14px;
  overflow-x: auto;
  font: 13px/1.55 ui-monospace, Menlo, Consolas, monospace;
}

.concept-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
  margin-top: 10px;
}

.concept-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 14px;
}

.concept-card h4 {
  font-size: 14px;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 4px;
}

.concept-card p {
  font-size: 12.5px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

/* Footer */
footer {
  text-align: center;
  margin-top: 24px;
  font-size: 13px;
  color: var(--text-muted);
}
</style>
</head>
<body>
<div class="container">
  <header>
    <div>
      <div class="brand-title">🕌 Prayer Engine</div>
      <div class="brand-sub">Universal Islamic Prayer Times, Qibla Compass & Hijri Moon-Sighting Engine</div>
    </div>
    <button class="btn-header" id="btn-gps">📍 Use My GPS</button>
  </header>

  <!-- Navigation Tabs -->
  <div class="nav-tabs">
    <button class="tab-btn active" id="tab-play">🕌 Live Prayer Times</button>
    <button class="tab-btn" id="tab-guide">📖 Library Guide & Docs</button>
  </div>

  <!-- TAB 1: PLAYGROUND -->
  <div id="view-play">
    <!-- City Presets Bar -->
    <div class="city-bar" id="city-bar"></div>

    <!-- Hero Card -->
    <div class="hero-card">
      <div class="hijri-row">
        <div>
          <div class="hijri-ur" id="hijri-ur">--</div>
          <div class="hijri-en" id="hijri-en">--</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="badge-gyarween" id="badge-gyarween" style="display:none;">★ گیارہویں شریف (11th)</span>
          <div class="moon-adjust">
            <span style="font-weight:600; color:var(--text-muted);">Moon:</span>
            <button class="btn-adj" data-adj="-1">-1d</button>
            <button class="btn-adj active" data-adj="0">0</button>
            <button class="btn-adj" data-adj="1">+1d</button>
          </div>
        </div>
      </div>

      <!-- Next Prayer Timer Box -->
      <div class="next-box">
        <div>
          <div class="next-label">Next Prayer</div>
          <div class="next-name" id="next-name">--</div>
        </div>
        <div style="text-align:right;">
          <div class="next-label">Time Remaining</div>
          <div class="next-timer" id="next-timer">--:--:--</div>
        </div>
      </div>
    </div>

    <!-- Makrooh Midday Alert -->
    <div class="alert-makrooh" id="alert-makrooh" style="display:none;">
      <span style="font-size:18px;">⚠️</span>
      <div>
        <strong>Makrooh Midday Window (Zawaal) in Progress!</strong>
        <div style="font-size:12.5px;">Dahwa-e-Kubra to Dhuhr start. Voluntary (Nafl) prayers and Sajdah are prohibited.</div>
      </div>
    </div>

    <!-- Quick Controls -->
    <div class="controls-row">
      <button class="btn-preset" id="btn-preset">★ Standard Hanafi Preset</button>

      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <div class="toggle-group" id="madhab-group">
          <button class="btn-toggle active" data-madhab="Hanafi">Hanafi Asr</button>
          <button class="btn-toggle" data-madhab="Shafi">Shafi'i Asr</button>
        </div>

        <div class="toggle-group" id="format-group">
          <button class="btn-toggle active" data-fmt="12">12-Hour</button>
          <button class="btn-toggle" data-fmt="24">24-Hour</button>
        </div>
      </div>
    </div>

    <!-- Table of 12 Times -->
    <div class="table-card">
      <table>
        <tbody id="tbl-body"></tbody>
      </table>
    </div>

    <!-- Info Strip: Qibla & Elevation -->
    <div class="info-grid">
      <div class="info-box">
        <div>
          <div class="info-label">Qibla Direction (to Kaaba)</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">Compass bearing from location</div>
        </div>
        <div class="info-val" id="val-qibla">--°</div>
      </div>

      <div class="info-box">
        <div>
          <div class="info-label" id="lbl-elev">Elevation Correction</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:2px;" id="desc-elev">--</div>
        </div>
        <div class="info-val" id="val-elev">--</div>
      </div>
    </div>

    <!-- Collapsible Advanced Settings -->
    <div class="advanced-card">
      <button class="adv-toggle" id="btn-adv">
        <span>⚙️ Advanced Settings & Precautionary Ihtiat (Optional)</span>
        <span id="adv-arrow">▼ Expand</span>
      </button>

      <div class="adv-body" id="adv-body" style="display:none;">
        <div class="form-grid">
          <div class="form-group">
            <label>Method</label>
            <select id="sel-method">
              <option value="Karachi">Karachi (University of Islamic Sciences)</option>
              <option value="MuslimWorldLeague">Muslim World League (MWL)</option>
              <option value="UmmAlQura">Umm al-Qura (Makkah)</option>
              <option value="Egyptian">Egyptian General Authority</option>
              <option value="NorthAmerica">ISNA (North America)</option>
              <option value="MoonsightingCommittee">Moonsighting Committee</option>
              <option value="Turkey">Turkey</option>
            </select>
          </div>

          <div class="form-group">
            <label>Target Date</label>
            <input type="date" id="input-date">
          </div>

          <div class="form-group">
            <label>Elevation (Meters)</label>
            <input type="number" id="input-elev" min="0" step="10" value="210">
          </div>

          <div class="form-group">
            <label>Latitude & Longitude</label>
            <div style="display:flex; gap:6px;">
              <input type="number" step="0.0001" id="input-lat" placeholder="Lat">
              <input type="number" step="0.0001" id="input-lng" placeholder="Lng">
            </div>
          </div>
        </div>

        <label style="font-size:11.5px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">
          Precautionary Adjustments / Ihtiat (Minutes)
        </label>
        <div class="ihtiat-row" id="ihtiat-row"></div>
      </div>
    </div>
  </div>

  <!-- TAB 2: LIBRARY GUIDE & DOCUMENTATION -->
  <div id="view-guide" style="display:none;" class="guide-wrap">
    <div class="guide-box">
      <h2>📖 Developer Integration Guide for @marslanmustafa/prayer-engine</h2>
      <p>
        Universal prayer times, Qibla compass, and Hijri moon-sighting engine with multi-school support.
        Zero external dependencies, TypeScript native, compatible with React Native, Next.js, and Node.js.
      </p>

      <div class="code-container">
        <div class="code-bar">
          <span>Bash (Installation)</span>
          <button class="btn-copy" onclick="copySnippet('npm i @marslanmustafa/prayer-engine')">Copy</button>
        </div>
        <pre>npm install @marslanmustafa/prayer-engine</pre>
      </div>
    </div>

    <!-- Core Concepts -->
    <div class="guide-box">
      <h2>Core Islamic Concepts Calculated</h2>
      <div class="concept-grid">
        <div class="concept-card">
          <h4>☀️ Dahwa-e-Kubra (ضحوہ کبریٰ)</h4>
          <p>
            <strong>The Islamic Midday.</strong> Exact halfway point between Subh-e-Sadiq (Fajr) and Maghrib: <code>Fajr + (Maghrib - Fajr)/2</code>.
            In Fiqh Hanafi, it is the strict deadline for Ramadan fasting intention (<em>Niyyah</em>).
          </p>
        </div>

        <div class="concept-card">
          <h4>⚠️ Makrooh Midday Window (Zawaal)</h4>
          <p>
            Voluntary prayers are prohibited during solar midday. The engine calculates the exact interval from <strong>Dahwa-e-Kubra to Dhuhr start</strong>.
          </p>
        </div>

        <div class="concept-card">
          <h4>⏱️ Precautionary Minutes (Ihtiat)</h4>
          <p>
            Traditional Islamic calendars add safety margins: <strong>-2 mins</strong> before Fajr to conclude Sehri safely, and <strong>+2 to +3 mins</strong> after sunset before breaking fast.
          </p>
        </div>

        <div class="concept-card">
          <h4>⛰️ Elevation Horizon Dip</h4>
          <p>
            Elevated cities (Lahore at 210m, Quetta at 1,680m) experience earlier sunrise and later sunset due to atmospheric horizon depression.
          </p>
        </div>

        <div class="concept-card">
          <h4>🌙 Ruet-e-Hilal Moon Engine</h4>
          <p>
            Allows <code>[-2 to +2]</code> day offsets to synchronize with local Ruet-e-Hilal committees, with Urdu/Arabic month names and Gyarween Sharif detection on the 11th.
          </p>
        </div>

        <div class="concept-card">
          <h4>🧭 Qibla Compass Bearing</h4>
          <p>
            Calculates exact compass bearing from any coordinates directly towards the Holy Kaaba in Makkah.
          </p>
        </div>
      </div>
    </div>

    <!-- Next.js Integration -->
    <div class="guide-box">
      <h2>Next.js (App Router API Route)</h2>
      <p>Create an API endpoint at <code>app/api/prayers/route.ts</code> to serve prayer times:</p>
      <div class="code-container">
        <div class="code-bar">
          <span>TypeScript (Next.js)</span>
          <button class="btn-copy" onclick="copySnippet(nextJsCode)">Copy</button>
        </div>
        <pre id="pre-nextjs"></pre>
      </div>
    </div>

    <!-- React Native Integration -->
    <div class="guide-box">
      <h2>React Native & Expo Integration</h2>
      <p>Works directly with Metro bundler and Hermes with zero polyfills:</p>
      <div class="code-container">
        <div class="code-bar">
          <span>TypeScript (React Native / Expo)</span>
          <button class="btn-copy" onclick="copySnippet(rnCode)">Copy</button>
        </div>
        <pre id="pre-rn"></pre>
      </div>
    </div>

    <!-- Full API Schema -->
    <div class="guide-box">
      <h2>API Return Schema</h2>
      <p>Calling <code>getPrayerTimes(coords, date, options)</code> returns all 12 times and metadata:</p>
      <div class="code-container">
        <div class="code-bar">
          <span>TypeScript Interface</span>
          <button class="btn-copy" onclick="copySnippet(schemaCode)">Copy</button>
        </div>
        <pre id="pre-schema"></pre>
      </div>
    </div>
  </div>

  <footer>
    <strong>@marslanmustafa/prayer-engine</strong> &bull; MIT License &bull; Universal Multi-School Support
  </footer>
</div>

<!-- Embedded Prayer Engine Bundle -->
<script>
${bundleCode}
</script>

<!-- Application Logic -->
<script>
(function() {
  var PE = window.PrayerEngine;
  if (!PE) {
    alert("PrayerEngine bundle failed to load.");
    return;
  }

  var CITIES = [
    { name: 'Lahore', nameUr: 'لاہور', lat: 31.5204, lng: 74.3587, elevation: 210, tz: 'Asia/Karachi' },
    { name: 'Karachi', nameUr: 'کراچی', lat: 24.8607, lng: 67.0011, elevation: 8, tz: 'Asia/Karachi' },
    { name: 'Islamabad', nameUr: 'اسلام آباد', lat: 33.6844, lng: 73.0479, elevation: 540, tz: 'Asia/Karachi' },
    { name: 'Multan', nameUr: 'ملتان', lat: 30.1575, lng: 71.5249, elevation: 122, tz: 'Asia/Karachi' },
    { name: 'Faisalabad', nameUr: 'فیصل آباد', lat: 31.4504, lng: 73.135, elevation: 184, tz: 'Asia/Karachi' },
    { name: 'Peshawar', nameUr: 'پشاور', lat: 34.0151, lng: 71.5249, elevation: 359, tz: 'Asia/Karachi' },
    { name: 'Quetta', nameUr: 'کوئٹہ', lat: 30.1798, lng: 66.975, elevation: 1680, tz: 'Asia/Karachi' },
    { name: 'Makkah', nameUr: 'مکہ مکرمہ', lat: 21.3891, lng: 39.8579, elevation: 277, tz: 'Asia/Riyadh' },
    { name: 'Madinah', nameUr: 'مدینہ منورہ', lat: 24.5247, lng: 39.5692, elevation: 608, tz: 'Asia/Riyadh' },
    { name: 'Dubai', nameUr: 'دبئی', lat: 25.2048, lng: 55.2708, elevation: 5, tz: 'Asia/Dubai' },
    { name: 'London', nameUr: 'لندن', lat: 51.5074, lng: -0.1278, elevation: 11, tz: 'Europe/London' },
    { name: 'New York', nameUr: 'نیویارک', lat: 40.7128, lng: -74.006, elevation: 10, tz: 'America/New_York' }
  ];

  var state = {
    city: CITIES[0],
    lat: CITIES[0].lat,
    lng: CITIES[0].lng,
    elevation: CITIES[0].elevation,
    tz: CITIES[0].tz,
    madhab: 'Hanafi',
    fmt12: true,
    moonAdj: 0,
    method: 'Karachi',
    date: new Date(),
    adjustments: { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
    showAdv: false
  };

  // Init Date
  var now = new Date();
  var dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  document.getElementById('input-date').value = dateStr;

  // Render City Chips
  var cityBar = document.getElementById('city-bar');
  CITIES.forEach(function(c, i) {
    var btn = document.createElement('button');
    btn.className = 'city-chip' + (i === 0 ? ' active' : '');
    btn.textContent = c.name + ' (' + c.nameUr + ')';
    btn.onclick = function() {
      state.city = c;
      state.lat = c.lat;
      state.lng = c.lng;
      state.elevation = c.elevation;
      state.tz = c.tz;
      document.getElementById('input-lat').value = c.lat;
      document.getElementById('input-lng').value = c.lng;
      document.getElementById('input-elev').value = c.elevation;
      document.querySelectorAll('.city-chip').forEach(function(el) { el.classList.remove('active'); });
      btn.classList.add('active');
      render();
    };
    cityBar.appendChild(btn);
  });

  // Render Ihtiat Cells
  var ihtiatRow = document.getElementById('ihtiat-row');
  ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(function(p) {
    var cell = document.createElement('div');
    cell.className = 'ihtiat-cell';
    cell.innerHTML = '<span>' + p.toUpperCase() + '</span><input type="number" step="1" value="0" id="iht_' + p + '">';
    ihtiatRow.appendChild(cell);
    cell.querySelector('input').oninput = function(e) {
      state.adjustments[p] = parseInt(e.target.value, 10) || 0;
      render();
    };
  });

  document.getElementById('input-lat').value = state.lat;
  document.getElementById('input-lng').value = state.lng;

  // View Switcher
  document.getElementById('tab-play').onclick = function() {
    document.getElementById('view-play').style.display = 'block';
    document.getElementById('view-guide').style.display = 'none';
    document.getElementById('tab-play').classList.add('active');
    document.getElementById('tab-guide').classList.remove('active');
  };
  document.getElementById('tab-guide').onclick = function() {
    document.getElementById('view-play').style.display = 'none';
    document.getElementById('view-guide').style.display = 'block';
    document.getElementById('tab-guide').classList.add('active');
    document.getElementById('tab-play').classList.remove('active');
  };

  // GPS
  document.getElementById('btn-gps').onclick = function() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(function(pos) {
      var uLat = parseFloat(pos.coords.latitude.toFixed(4));
      var uLng = parseFloat(pos.coords.longitude.toFixed(4));
      state.lat = uLat;
      state.lng = uLng;
      state.elevation = 0;
      document.getElementById('input-lat').value = uLat;
      document.getElementById('input-lng').value = uLng;
      document.getElementById('input-elev').value = 0;
      document.querySelectorAll('.city-chip').forEach(function(el) { el.classList.remove('active'); });
      render();
    }, function(err) { alert("GPS Error: " + err.message); });
  };

  // Standard Hanafi Preset Button
  document.getElementById('btn-preset').onclick = function() {
    state.method = 'Karachi';
    state.madhab = 'Hanafi';
    state.elevation = 210;
    ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(function(p) {
      state.adjustments[p] = 0;
      var el = document.getElementById('iht_' + p);
      if (el) el.value = 0;
    });
    document.getElementById('input-elev').value = 210;
    document.getElementById('sel-method').value = 'Karachi';
    document.querySelectorAll('#madhab-group button').forEach(function(b) {
      b.classList.toggle('active', b.getAttribute('data-madhab') === 'Hanafi');
    });
    render();
  };

  // Madhab toggle
  document.querySelectorAll('#madhab-group button').forEach(function(btn) {
    btn.onclick = function() {
      state.madhab = btn.getAttribute('data-madhab');
      document.querySelectorAll('#madhab-group button').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      render();
    };
  });

  // Format toggle
  document.querySelectorAll('#format-group button').forEach(function(btn) {
    btn.onclick = function() {
      state.fmt12 = btn.getAttribute('data-fmt') === '12';
      document.querySelectorAll('#format-group button').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      render();
    };
  });

  // Moon adjustment buttons
  document.querySelectorAll('.btn-adj').forEach(function(btn) {
    btn.onclick = function() {
      state.moonAdj = parseInt(btn.getAttribute('data-adj'), 10);
      document.querySelectorAll('.btn-adj').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      render();
    };
  });

  // Advanced toggle
  document.getElementById('btn-adv').onclick = function() {
    state.showAdv = !state.showAdv;
    document.getElementById('adv-body').style.display = state.showAdv ? 'block' : 'none';
    document.getElementById('adv-arrow').textContent = state.showAdv ? '▲ Hide' : '▼ Expand';
  };

  document.getElementById('sel-method').onchange = function(e) { state.method = e.target.value; render(); };
  document.getElementById('input-date').onchange = function(e) {
    var parts = e.target.value.split('-').map(Number);
    state.date = new Date(parts[0], parts[1] - 1, parts[2]);
    render();
  };
  document.getElementById('input-elev').oninput = function(e) { state.elevation = Math.max(0, parseFloat(e.target.value) || 0); render(); };
  document.getElementById('input-lat').oninput = function(e) { state.lat = parseFloat(e.target.value) || 0; render(); };
  document.getElementById('input-lng').oninput = function(e) { state.lng = parseFloat(e.target.value) || 0; render(); };

  function fmtTime(d) {
    if (!d) return '--:--';
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: state.tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: state.fmt12
    }).format(d);
  }

  function render() {
    var prayers = PE.getPrayerTimes({ latitude: state.lat, longitude: state.lng }, state.date, {
      method: state.method,
      madhab: state.madhab,
      elevation: state.elevation,
      dhuhrMargin: 'none',
      rounding: 'None',
      adjustments: state.adjustments
    });

    var hijri = PE.getHijriDate(state.date, { adjustment: state.moonAdj });
    var elevShift = PE.getElevationShift(state.lat, state.date, state.elevation);

    // Hijri texts
    document.getElementById('hijri-ur').textContent = hijri.formatted.ur + ' (' + hijri.dayOfWeek.ur + ')';
    document.getElementById('hijri-en').textContent = hijri.formatted.en + ' • ' + hijri.dayOfWeek.en;
    document.getElementById('badge-gyarween').style.display = hijri.isGyarweenSharif ? 'inline-block' : 'none';

    // Qibla & Elevation
    document.getElementById('val-qibla').textContent = prayers.qibla.toFixed(1) + '°';
    document.getElementById('lbl-elev').textContent = 'Elevation (' + state.elevation + 'm)';
    if (elevShift > 0) {
      document.getElementById('desc-elev').textContent = 'Sunrise is ' + Math.round(elevShift) + 's earlier & Maghrib ' + Math.round(elevShift) + 's later';
      document.getElementById('val-elev').textContent = '±' + Math.round(elevShift) + 's';
    } else {
      document.getElementById('desc-elev').textContent = 'Standard sea-level calculation';
      document.getElementById('val-elev').textContent = '0s';
    }

    // Makrooh Window
    var currentTime = new Date();
    var isMakrooh = currentTime >= prayers.makroohMidday.start && currentTime < prayers.makroohMidday.end;
    document.getElementById('alert-makrooh').style.display = isMakrooh ? 'flex' : 'none';

    // Table rows
    var rows = [
      { key: 'fajr', name: 'Fajr', nameUr: 'فجر', time: prayers.fajr, hint: 'Subh-e-Sadiq (Sehri ends)' },
      { key: 'sunrise', name: 'Sunrise', nameUr: 'طلوع آفتاب', time: prayers.sunrise, hint: 'Fajr ends' },
      { key: 'ishraq', name: 'Ishraq', nameUr: 'اشراق', time: prayers.ishraq, hint: '20 mins post-sunrise', special: true },
      { key: 'dahwaKubra', name: 'Dahwa-e-Kubra', nameUr: 'ضحوہ کبریٰ', time: prayers.dahwaKubra, hint: 'Islamic Midday midpoint', special: true },
      { key: 'makrooh', name: 'Makrooh Midday (Zawaal)', nameUr: 'مکروہ وقت / زوال', timeStr: fmtTime(prayers.makroohMidday.start) + ' → ' + fmtTime(prayers.makroohMidday.end), hint: 'No Nafl prayers allowed', makrooh: true },
      { key: 'dhuhr', name: 'Dhuhr', nameUr: 'ظہر', time: prayers.dhuhr, hint: 'Solar noon / Zawaal ends' },
      { key: 'asr', name: 'Asr (' + state.madhab + ')', nameUr: 'عصر', time: prayers.asr, hint: state.madhab === 'Hanafi' ? '2x shadow (Hanafi)' : '1x shadow (Shafi)' },
      { key: 'sunset', name: 'Sunset / Iftar', nameUr: 'غروب آفتاب', time: prayers.sunset, hint: 'Fasting concludes' },
      { key: 'maghrib', name: 'Maghrib', nameUr: 'مغرب', time: prayers.maghrib, hint: 'Immediate post-sunset' },
      { key: 'isha', name: 'Isha', nameUr: 'عشاء', time: prayers.isha, hint: 'Twilight disappears' },
      { key: 'midnight', name: 'Islamic Midnight', nameUr: 'نصف اللیل', time: prayers.midnight, hint: 'Midpoint of Maghrib & Fajr', special: true },
      { key: 'tahajjud', name: 'Tahajjud Time', nameUr: 'تہجد', time: prayers.tahajjud, hint: 'Last third of night begins', special: true }
    ];

    var curKey = '';
    var nextItem = null;
    var order = [
      { key: 'fajr', name: 'Fajr', time: prayers.fajr },
      { key: 'sunrise', name: 'Sunrise', time: prayers.sunrise },
      { key: 'dhuhr', name: 'Dhuhr', time: prayers.dhuhr },
      { key: 'asr', name: 'Asr', time: prayers.asr },
      { key: 'maghrib', name: 'Maghrib', time: prayers.maghrib },
      { key: 'isha', name: 'Isha', time: prayers.isha }
    ];

    for (var i = 0; i < order.length; i++) {
      if (order[i].time <= currentTime) curKey = order[i].key;
      else if (!nextItem) nextItem = order[i];
    }

    var html = '';
    rows.forEach(function(r) {
      var isActive = r.key === curKey;
      var cls = '';
      if (isActive) cls = 'row-active';
      else if (r.special) cls = 'row-special';
      else if (r.makrooh) cls = 'row-makrooh';

      html += '<tr class="' + cls + '">';
      html += '<td>' + r.name + '<div style="font-size:11.5px; color:var(--text-muted); font-weight:400;">' + r.hint + '</div></td>';
      html += '<td class="td-urdu">' + r.nameUr + '</td>';
      html += '<td class="td-time">' + (r.timeStr ? r.timeStr : fmtTime(r.time)) + '</td>';
      html += '</tr>';
    });
    document.getElementById('tbl-body').innerHTML = html;

    // Next timer update
    var targetTime = nextItem ? nextItem.time : new Date(prayers.fajr.getTime() + 86400000);
    var targetName = nextItem ? nextItem.name : 'Fajr (Tomorrow)';
    document.getElementById('next-name').textContent = targetName;

    var diff = Math.max(0, Math.floor((targetTime.getTime() - currentTime.getTime()) / 1000));
    var h = Math.floor(diff / 3600);
    var m = Math.floor((diff % 3600) / 60);
    var s = diff % 60;
    document.getElementById('next-timer').textContent =
      String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  setInterval(render, 1000);
  render();

  // Guide Pre blocks
  window.nextJsCode = "import { NextResponse } from 'next/server';\\nimport { getPrayerTimes, getHijriDate } from '@marslanmustafa/prayer-engine';\\n\\nexport async function GET(request: Request) {\\n  const { searchParams } = new URL(request.url);\\n  const lat = parseFloat(searchParams.get('lat') || '31.5204');\\n  const lng = parseFloat(searchParams.get('lng') || '74.3587');\\n  const elevation = parseFloat(searchParams.get('elevation') || '210');\\n\\n  const prayers = getPrayerTimes({ latitude: lat, longitude: lng }, new Date(), {\\n    elevation,\\n    madhab: 'Hanafi',\\n  });\\n\\n  return NextResponse.json({\\n    prayers,\\n    hijri: getHijriDate(),\\n  });\\n}";

  window.rnCode = "import React, { useEffect, useState } from 'react';\\nimport { View, Text } from 'react-native';\\nimport * as Location from 'expo-location';\\nimport { getPrayerTimes, getHijriDate } from '@marslanmustafa/prayer-engine';\\n\\nexport function PrayerTimesScreen() {\\n  const [times, setTimes] = useState(null);\\n  const [hijri, setHijri] = useState(null);\\n\\n  useEffect(() => {\\n    (async () => {\\n      const { status } = await Location.requestForegroundPermissionsAsync();\\n      const loc = status === 'granted'\\n        ? await Location.getCurrentPositionAsync({})\\n        : { coords: { latitude: 24.8607, longitude: 67.0011 } };\\n\\n      setTimes(getPrayerTimes({ latitude: loc.coords.latitude, longitude: loc.coords.longitude }));\\n      setHijri(getHijriDate());\\n    })();\\n  }, []);\\n\\n  if (!times) return <Text>Loading...</Text>;\\n\\n  return (\\n    <View style={{ padding: 20 }}>\\n      <Text style={{ fontSize: 18, color: '#166534' }}>{hijri?.formatted.ur}</Text>\\n      <Text>Fajr: {times.fajr.toLocaleTimeString()}</Text>\\n      <Text>Dahwa-e-Kubra: {times.dahwaKubra.toLocaleTimeString()}</Text>\\n      <Text>Dhuhr: {times.dhuhr.toLocaleTimeString()}</Text>\\n      <Text>Asr (Hanafi): {times.asr.toLocaleTimeString()}</Text>\\n      <Text>Maghrib: {times.maghrib.toLocaleTimeString()}</Text>\\n      <Text>Isha: {times.isha.toLocaleTimeString()}</Text>\\n    </View>\\n  );\\n}";

  window.schemaCode = "interface PrayerTimesResult {\\n  fajr: Date;\\n  sunrise: Date; // adjusted for elevation dip\\n  ishraq: Date; // 20m post-sunrise\\n  dahwaKubra: Date; // Islamic midday (Fajr + (Maghrib - Fajr)/2)\\n  makroohMidday: { start: Date; end: Date }; // Zawaal window\\n  dhuhr: Date;\\n  asr: Date; // Hanafi (2x) or Shafi (1x)\\n  sunset: Date; // adjusted for elevation dip\\n  maghrib: Date; // adjusted for elevation dip\\n  isha: Date;\\n  midnight: Date; // Islamic night midpoint\\n  tahajjud: Date; // Last third of night\\n  currentPrayer: string;\\n  nextPrayer: string;\\n  qibla: number; // compass bearing to Kaaba\\n  elevation: number;\\n  elevationShift: number; // in seconds\\n  adjustments: PrayerAdjustments;\\n}";

  document.getElementById('pre-nextjs').textContent = window.nextJsCode;
  document.getElementById('pre-rn').textContent = window.rnCode;
  document.getElementById('pre-schema').textContent = window.schemaCode;

  window.copySnippet = function(text) {
    navigator.clipboard.writeText(text).then(function() {
      alert("Copied to clipboard!");
    });
  };
})();
</script>
</body>
</html>
`;

fs.writeFileSync('./index.html', htmlContent, 'utf8');
console.log('Successfully regenerated SEO-optimized index.html without Dawat-e-Islami branding!');
