import React, { useState, useEffect, useMemo } from 'react';
import {
  getPrayerTimes,
  getHijriDate,
  getElevationShift,
  Rounding,
  CalculationMethod,
  PrayerCalculationOptions,
} from '../src/index';

interface City {
  name: string;
  nameUr: string;
  lat: number;
  lng: number;
  elevation: number;
  tz: string;
}

const POPULAR_CITIES: City[] = [
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
  { name: 'New York', nameUr: 'نیویارک', lat: 40.7128, lng: -74.006, elevation: 10, tz: 'America/New_York' },
];

export function App() {
  const [currentView, setCurrentView] = useState<'playground' | 'guide'>('playground');
  const [selectedCity, setSelectedCity] = useState<City>(POPULAR_CITIES[0]); // Lahore default
  const [lat, setLat] = useState<number>(POPULAR_CITIES[0].lat);
  const [lng, setLng] = useState<number>(POPULAR_CITIES[0].lng);
  const [elevation, setElevation] = useState<number>(POPULAR_CITIES[0].elevation);
  const [tz, setTz] = useState<string>(POPULAR_CITIES[0].tz);

  // Simple Controls
  const [madhab, setMadhab] = useState<'Hanafi' | 'Shafi'>('Hanafi');
  const [use12Hour, setUse12Hour] = useState<boolean>(true);
  const [moonAdjustment, setMoonAdjustment] = useState<number>(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: string }>({});

  // Advanced Controls
  const [method, setMethod] = useState<string>('Karachi');
  const [dhuhrMargin, setDhuhrMargin] = useState<'method' | 'none'>('none');
  const [precision, setPrecision] = useState<'None' | 'Nearest'>('None');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  });

  // Precautionary Ihtiat Adjustments (minutes)
  const [adjustments, setAdjustments] = useState({
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  });

  // Live timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle City Select
  const handleCitySelect = (c: City) => {
    setSelectedCity(c);
    setLat(c.lat);
    setLng(c.lng);
    setElevation(c.elevation);
    setTz(c.tz);
  };

  // "Use My GPS Location"
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = parseFloat(pos.coords.latitude.toFixed(4));
        const uLng = parseFloat(pos.coords.longitude.toFixed(4));
        setLat(uLat);
        setLng(uLng);
        setSelectedCity({
          name: 'My GPS Location',
          nameUr: 'میری لوکیشن',
          lat: uLat,
          lng: uLng,
          elevation: 0,
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Karachi',
        });
      },
      (err) => alert(`Unable to fetch location: ${err.message}`)
    );
  };

  // Reset to Dawat-e-Islami Style Preset
  const handleResetToDawatEIslami = () => {
    setMethod('Karachi');
    setMadhab('Hanafi');
    setElevation(210);
    setDhuhrMargin('none');
    setPrecision('None');
    setAdjustments({
      fajr: 0,
      sunrise: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0,
    });
  };

  // Target Date object
  const targetDate = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [selectedDate]);

  // Compute Prayer Times
  const prayerTimes = useMemo(() => {
    try {
      const options: PrayerCalculationOptions = {
        method,
        madhab,
        elevation,
        rounding: precision === 'None' ? Rounding.None : Rounding.Nearest,
        dhuhrMargin,
        highLatitudeRule: 'auto',
        adjustments,
      };
      return getPrayerTimes({ latitude: lat, longitude: lng }, targetDate, options);
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [lat, lng, targetDate, method, madhab, elevation, precision, dhuhrMargin, adjustments]);

  // Compute Hijri Date
  const hijri = useMemo(() => {
    return getHijriDate(targetDate, { adjustment: moonAdjustment });
  }, [targetDate, moonAdjustment]);

  // Elevation shift duration in seconds
  const elevShiftSeconds = useMemo(() => {
    return getElevationShift(lat, targetDate, elevation);
  }, [lat, targetDate, elevation]);

  // Is Makrooh Midday currently in effect?
  const isMakroohNow = useMemo(() => {
    if (!prayerTimes) return false;
    const now = currentTime.getTime();
    return (
      now >= prayerTimes.makroohMidday.start.getTime() &&
      now < prayerTimes.makroohMidday.end.getTime()
    );
  }, [prayerTimes, currentTime]);

  // Format Time Helper
  const formatTime = (d: Date | undefined) => {
    if (!d) return '--:--';
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: precision === 'None' ? '2-digit' : undefined,
        hour12: use12Hour,
      }).format(d);
    } catch {
      return d.toLocaleTimeString([], { hour12: use12Hour });
    }
  };

  // Live Countdown Text
  const countdown = useMemo(() => {
    if (!prayerTimes) return { text: '', targetName: '', activeKey: '' };
    const now = currentTime;
    const sameDay = now.toDateString() === targetDate.toDateString();

    if (!sameDay) {
      return { text: '', targetName: 'Pick today to see live timer', activeKey: '' };
    }

    const order: Array<{ key: string; name: string; time: Date }> = [
      { key: 'fajr', name: 'Fajr', time: prayerTimes.fajr },
      { key: 'sunrise', name: 'Sunrise', time: prayerTimes.sunrise },
      { key: 'dhuhr', name: 'Dhuhr', time: prayerTimes.dhuhr },
      { key: 'asr', name: 'Asr', time: prayerTimes.asr },
      { key: 'maghrib', name: 'Maghrib', time: prayerTimes.maghrib },
      { key: 'isha', name: 'Isha', time: prayerTimes.isha },
    ];

    let curKey = '';
    let nxtItem: { key: string; name: string; time: Date } | null = null;

    for (const item of order) {
      if (item.time <= now) {
        curKey = item.key;
      } else if (!nxtItem) {
        nxtItem = item;
      }
    }

    let targetTime: Date;
    let targetName: string;

    if (nxtItem) {
      targetTime = nxtItem.time;
      targetName = nxtItem.name;
    } else {
      // Tomorrow Fajr
      const tomorrow = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1);
      const res = getPrayerTimes({ latitude: lat, longitude: lng }, tomorrow, {
        method,
        madhab,
        elevation,
        rounding: precision === 'None' ? Rounding.None : Rounding.Nearest,
        dhuhrMargin,
        adjustments,
      });
      targetTime = res.fajr;
      targetName = 'Fajr (Tomorrow)';
    }

    const diff = Math.max(0, Math.floor((targetTime.getTime() - now.getTime()) / 1000));
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    const text = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    return { text, targetName, activeKey: curKey };
  }, [
    prayerTimes,
    currentTime,
    targetDate,
    lat,
    lng,
    method,
    madhab,
    elevation,
    precision,
    dhuhrMargin,
    adjustments,
  ]);

  const copyCode = (key: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus((prev) => ({ ...prev, [key]: 'Copied!' }));
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [key]: 'Copy' }));
      }, 1500);
    });
  };

  // Code snippet string
  const snippet = useMemo(() => {
    return `import { getPrayerTimes, getHijriDate } from '@marslanmustafa/prayer-engine';

const times = getPrayerTimes(
  { latitude: ${lat}, longitude: ${lng} },
  new Date(),
  {
    method: '${method}',
    madhab: '${madhab}',
    elevation: ${elevation},
    dhuhrMargin: '${dhuhrMargin}',
  }
);

console.log('Fajr (Sehri Ends):', times.fajr);
console.log('Dahwa-e-Kubra (Midday):', times.dahwaKubra);
console.log('Makrooh Midday Window:', times.makroohMidday);
console.log('Dhuhr:', times.dhuhr);
console.log('Asr (Hanafi):', times.asr);
console.log('Maghrib (Iftar):', times.maghrib);
console.log('Isha:', times.isha);
console.log('Islamic Midnight:', times.midnight);
console.log('Tahajjud (Last third):', times.tahajjud);
console.log('Qibla Compass Bearing:', times.qibla);`;
  }, [lat, lng, method, madhab, elevation, dhuhrMargin]);

  return (
    <div className="container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="brand">
          <span className="brand-icon">🕌</span>
          <div>
            <h1 className="brand-title">Prayer Engine</h1>
            <p className="brand-sub">Universal Prayer, Qibla & Hijri Moon-Sighting Library</p>
          </div>
        </div>

        <div className="nav-actions">
          <button className="btn-icon" onClick={handleUseGPS}>
            📍 Use My GPS
          </button>
          <button
            className="btn-icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </nav>

      {/* Main Mode Switcher: Live Dashboard vs Library Guide */}
      <div className="view-switcher">
        <button
          className={`view-btn ${currentView === 'playground' ? 'active' : ''}`}
          onClick={() => setCurrentView('playground')}
        >
          🕌 Live Playground ({selectedCity.name})
        </button>
        <button
          className={`view-btn ${currentView === 'guide' ? 'active' : ''}`}
          onClick={() => setCurrentView('guide')}
        >
          📖 Library Guide & Documentation
        </button>
      </div>

      {/* VIEW 1: LIVE PLAYGROUND */}
      {currentView === 'playground' && (
        <>
          {/* Quick City Presets Bar */}
          <div className="city-bar">
            {POPULAR_CITIES.map((c) => (
              <button
                key={c.name}
                className={`city-pill ${selectedCity.name === c.name ? 'active' : ''}`}
                onClick={() => handleCitySelect(c)}
              >
                {c.name} ({c.nameUr})
              </button>
            ))}
          </div>

          {/* Hero Next Prayer & Hijri Card */}
          <div className="hero-card">
            <div className="hero-header">
              <div>
                <div className="hijri-date-title">{hijri.formatted.ur} ({hijri.dayOfWeek.ur})</div>
                <div className="hijri-english">
                  {hijri.formatted.en} &bull; {hijri.dayOfWeek.en}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {hijri.isGyarweenSharif && (
                  <span style={{ background: 'var(--gold)', color: '#fff', padding: '4px 8px', borderRadius: 6, fontSize: '12px', fontWeight: 700 }}>
                    ★ گیارہویں شریف
                  </span>
                )}
                <div className="moon-adjust-bar">
                  <span style={{ fontSize: '11px', color: 'var(--ink-secondary)', fontWeight: 600 }}>Moon Sighting:</span>
                  {[-1, 0, 1].map((adj) => (
                    <button
                      key={adj}
                      className={`btn-adjust ${moonAdjustment === adj ? 'active' : ''}`}
                      onClick={() => setMoonAdjustment(adj)}
                    >
                      {adj > 0 ? `+${adj}` : adj}d
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Prayer Countdown Bar */}
            <div className="next-prayer-banner">
              <div>
                <span style={{ fontSize: '13px', color: 'var(--ink-secondary)', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>
                  Next Prayer
                </span>
                <span className="next-prayer-text">{countdown.targetName}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '13px', color: 'var(--ink-secondary)', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>
                  Time Remaining
                </span>
                <span className="countdown-timer">{countdown.text || '--:--:--'}</span>
              </div>
            </div>
          </div>

          {/* Makrooh Midday Alert (Zawaal) */}
          {isMakroohNow && (
            <div className="alert-banner">
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div>
                <strong>Makrooh Midday Window (Zawaal) in Progress!</strong>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>
                  From Dahwa-e-Kubra to Dhuhr ({formatTime(prayerTimes?.makroohMidday.start)} &rarr; {formatTime(prayerTimes?.makroohMidday.end)}). Voluntary (Nafl) prayers are prohibited.
                </div>
              </div>
            </div>
          )}

          {/* Quick Controls Bar */}
          <div className="quick-controls">
            <button className="preset-btn" onClick={handleResetToDawatEIslami}>
              ★ Use Dawat-e-Islami Style
            </button>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {/* Asr Madhab Toggle */}
              <div className="toggle-group">
                <button
                  className={`toggle-btn ${madhab === 'Hanafi' ? 'active' : ''}`}
                  onClick={() => setMadhab('Hanafi')}
                >
                  Hanafi Asr (Later)
                </button>
                <button
                  className={`toggle-btn ${madhab === 'Shafi' ? 'active' : ''}`}
                  onClick={() => setMadhab('Shafi')}
                >
                  Shafi'i (Earlier)
                </button>
              </div>

              {/* Time Format Toggle */}
              <div className="toggle-group">
                <button
                  className={`toggle-btn ${use12Hour ? 'active' : ''}`}
                  onClick={() => setUse12Hour(true)}
                >
                  12-Hour
                </button>
                <button
                  className={`toggle-btn ${!use12Hour ? 'active' : ''}`}
                  onClick={() => setUse12Hour(false)}
                >
                  24-Hour
                </button>
              </div>
            </div>
          </div>

          {/* Prayer Times Grid */}
          {prayerTimes && (
            <div className="prayer-grid">
              {/* 1. Fajr */}
              <div className={`prayer-card ${countdown.activeKey === 'fajr' ? 'current' : ''}`}>
                <div className="prayer-card-header">
                  <span className="prayer-label">Fajr</span>
                  <span className="prayer-label-ur">فجر</span>
                </div>
                <div className="prayer-time">{formatTime(prayerTimes.fajr)}</div>
                <div className="prayer-hint">Subh-e-Sadiq (Sehri ends)</div>
              </div>

              {/* 2. Sunrise */}
              <div className={`prayer-card ${countdown.activeKey === 'sunrise' ? 'current' : ''}`}>
                <div className="prayer-card-header">
                  <span className="prayer-label">Sunrise</span>
                  <span className="prayer-label-ur">طلوع آفتاب</span>
                </div>
                <div className="prayer-time">{formatTime(prayerTimes.sunrise)}</div>
                <div className="prayer-hint">Fajr time concludes</div>
              </div>

              {/* 3. Ishraq */}
              <div className="prayer-card special">
                <div className="prayer-card-header">
                  <span className="prayer-label" style={{ color: 'var(--gold)' }}>Ishraq</span>
                  <span className="prayer-label-ur">اشراق</span>
                </div>
                <div className="prayer-time" style={{ color: 'var(--gold)' }}>{formatTime(prayerTimes.ishraq)}</div>
                <div className="prayer-hint">20 mins after sunrise</div>
              </div>

              {/* 4. Dahwa-e-Kubra */}
              <div className="prayer-card special">
                <div className="prayer-card-header">
                  <span className="prayer-label" style={{ color: 'var(--gold)' }}>Dahwa-e-Kubra</span>
                  <span className="prayer-label-ur">ضحوہ کبریٰ</span>
                </div>
                <div className="prayer-time" style={{ color: 'var(--gold)' }}>{formatTime(prayerTimes.dahwaKubra)}</div>
                <div className="prayer-hint">Islamic Midday midpoint</div>
              </div>

              {/* 5. Dhuhr */}
              <div className={`prayer-card ${countdown.activeKey === 'dhuhr' ? 'current' : ''}`}>
                <div className="prayer-card-header">
                  <span className="prayer-label">Dhuhr</span>
                  <span className="prayer-label-ur">ظہر</span>
                </div>
                <div className="prayer-time">{formatTime(prayerTimes.dhuhr)}</div>
                <div className="prayer-hint">Zawaal ends / Solar noon</div>
              </div>

              {/* 6. Asr */}
              <div className={`prayer-card ${countdown.activeKey === 'asr' ? 'current' : ''}`}>
                <div className="prayer-card-header">
                  <span className="prayer-label">Asr ({madhab})</span>
                  <span className="prayer-label-ur">عصر</span>
                </div>
                <div className="prayer-time">{formatTime(prayerTimes.asr)}</div>
                <div className="prayer-hint">{madhab === 'Hanafi' ? '2x shadow (Dawat-e-Islami)' : '1x shadow'}</div>
              </div>

              {/* 7. Sunset / Iftar */}
              <div className="prayer-card">
                <div className="prayer-card-header">
                  <span className="prayer-label">Sunset / Iftar</span>
                  <span className="prayer-label-ur">غروب آفتاب</span>
                </div>
                <div className="prayer-time">{formatTime(prayerTimes.sunset)}</div>
                <div className="prayer-hint">Fasting Iftar time</div>
              </div>

              {/* 8. Maghrib */}
              <div className={`prayer-card ${countdown.activeKey === 'maghrib' ? 'current' : ''}`}>
                <div className="prayer-card-header">
                  <span className="prayer-label">Maghrib</span>
                  <span className="prayer-label-ur">مغرب</span>
                </div>
                <div className="prayer-time">{formatTime(prayerTimes.maghrib)}</div>
                <div className="prayer-hint">Post-sunset prayer</div>
              </div>

              {/* 9. Isha */}
              <div className={`prayer-card ${countdown.activeKey === 'isha' ? 'current' : ''}`}>
                <div className="prayer-card-header">
                  <span className="prayer-label">Isha</span>
                  <span className="prayer-label-ur">عشاء</span>
                </div>
                <div className="prayer-time">{formatTime(prayerTimes.isha)}</div>
                <div className="prayer-hint">Red twilight disappears</div>
              </div>

              {/* 10. Islamic Midnight */}
              <div className="prayer-card">
                <div className="prayer-card-header">
                  <span className="prayer-label">Midnight (Islamic)</span>
                  <span className="prayer-label-ur">نصف اللیل</span>
                </div>
                <div className="prayer-time">{formatTime(prayerTimes.midnight)}</div>
                <div className="prayer-hint">Midpoint of Maghrib & Fajr</div>
              </div>

              {/* 11. Tahajjud */}
              <div className="prayer-card special">
                <div className="prayer-card-header">
                  <span className="prayer-label" style={{ color: 'var(--gold)' }}>Tahajjud</span>
                  <span className="prayer-label-ur">تہجد</span>
                </div>
                <div className="prayer-time" style={{ color: 'var(--gold)' }}>{formatTime(prayerTimes.tahajjud)}</div>
                <div className="prayer-hint">Last third of the night begins</div>
              </div>

              {/* 12. Makrooh Window */}
              <div className="prayer-card makrooh">
                <div className="prayer-card-header">
                  <span className="prayer-label" style={{ color: 'var(--danger)' }}>Makrooh Zawaal</span>
                  <span className="prayer-label-ur" style={{ color: 'var(--danger)' }}>مکروہ وقت</span>
                </div>
                <div className="prayer-time" style={{ fontSize: '17px', color: 'var(--danger)' }}>
                  {formatTime(prayerTimes.makroohMidday.start)} - {formatTime(prayerTimes.makroohMidday.end)}
                </div>
                <div className="prayer-hint">No Nafl prayers allowed</div>
              </div>
            </div>
          )}

          {/* Qibla & Elevation Info Strip */}
          <div className="info-strip">
            <div className="info-card">
              <div>
                <div className="info-title">Qibla Direction (from {selectedCity.name})</div>
                <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: 2 }}>
                  Compass bearing to the Holy Kaaba
                </div>
              </div>
              <div className="info-val">{prayerTimes?.qibla.toFixed(1)}°</div>
            </div>

            <div className="info-card">
              <div>
                <div className="info-title">Elevation Correction ({elevation}m)</div>
                <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: 2 }}>
                  {elevShiftSeconds > 0
                    ? `Sunrise is ${Math.round(elevShiftSeconds)}s earlier & Maghrib ${Math.round(elevShiftSeconds)}s later`
                    : 'Sea-level calculation'}
                </div>
              </div>
              <div className="info-val">
                {elevShiftSeconds > 0 ? `±${Math.round(elevShiftSeconds)}s` : '0s'}
              </div>
            </div>
          </div>

          {/* Collapsible Advanced Settings (Ihtiat, Custom Coordinates, Method) */}
          <div className="advanced-box">
            <button
              className="advanced-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <span>⚙️ Advanced Settings & Precautionary Ihtiat (Optional)</span>
              <span>{showAdvanced ? '▲ Hide' : '▼ Expand'}</span>
            </button>

            {showAdvanced && (
              <div className="advanced-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Calculation Method</label>
                    <select value={method} onChange={(e) => setMethod(e.target.value)}>
                      <option value="Karachi">Karachi (Dawat-e-Islami standard)</option>
                      <option value="MuslimWorldLeague">Muslim World League (MWL)</option>
                      <option value="UmmAlQura">Umm al-Qura (Makkah)</option>
                      <option value="Egyptian">Egyptian General Authority</option>
                      <option value="NorthAmerica">ISNA (North America)</option>
                      <option value="MoonsightingCommittee">Moonsighting Committee</option>
                      <option value="Turkey">Turkey</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Elevation (Meters)</label>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={elevation}
                      onChange={(e) => setElevation(Math.max(0, parseFloat(e.target.value) || 0))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Dhuhr Margin</label>
                    <select
                      value={dhuhrMargin}
                      onChange={(e) => setDhuhrMargin(e.target.value as any)}
                    >
                      <option value="none">None (Raw solar noon)</option>
                      <option value="method">Method default (+1 min)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Precision</label>
                    <select
                      value={precision}
                      onChange={(e) => setPrecision(e.target.value as any)}
                    >
                      <option value="None">Seconds precision</option>
                      <option value="Nearest">Minutes (rounded)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Latitude / Longitude</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="Lat"
                        value={lat}
                        onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                      />
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="Lng"
                        value={lng}
                        onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>

                {/* Ihtiat (Precautionary Minutes) Grid */}
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-secondary)', textTransform: 'uppercase' }}>
                  Precautionary Adjustments / Ihtiat (Minutes)
                </label>
                <div className="ihtiat-grid">
                  {(['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((p) => (
                    <div key={p} className="ihtiat-box">
                      <span>{p.toUpperCase()}</span>
                      <input
                        type="number"
                        step="1"
                        value={adjustments[p]}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          setAdjustments((prev) => ({ ...prev, [p]: val }));
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Code Snippet */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-secondary)', textTransform: 'uppercase' }}>
                      Generated Code
                    </span>
                    <button
                      className="btn-icon"
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                      onClick={() => copyCode('snippet', snippet)}
                    >
                      {copyStatus['snippet'] || 'Copy Code'}
                    </button>
                  </div>
                  <pre className="code-view">{snippet}</pre>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* VIEW 2: DEDICATED LIBRARY GUIDE & DOCUMENTATION */}
      {currentView === 'guide' && (
        <div className="guide-container">
          <div className="guide-hero">
            <h2>📖 Developer Guide for @marslanmustafa/prayer-engine</h2>
            <p>
              This guide walks you through every feature of the engine: Dawat-e-Islami calibration,
              Dahwa-e-Kubra calculation, Makrooh Zawaal protection, precautionary Ihtiat minutes, elevation
              corrections, Qibla calculation, and the Hijri moon-sighting engine.
            </p>
          </div>

          {/* Section 1: Installation */}
          <div className="guide-card">
            <h3>
              <span>1. Installation</span>
              <span className="badge-tag">Zero Dependencies</span>
            </h3>
            <p>Install the package into any modern TypeScript/JavaScript project:</p>
            <div className="code-wrapper">
              <div className="code-header">
                <span className="code-lang">Bash</span>
                <button
                  className="btn-icon"
                  style={{ padding: '2px 8px', fontSize: '11px' }}
                  onClick={() => copyCode('install', 'npm install @marslanmustafa/prayer-engine')}
                >
                  {copyStatus['install'] || 'Copy'}
                </button>
              </div>
              <pre>npm install @marslanmustafa/prayer-engine</pre>
            </div>
          </div>

          {/* Section 2: Core Concepts Explained */}
          <div className="guide-card">
            <h3>2. Key Islamic Concepts & How They Are Calculated</h3>
            <p>
              Why standard calculation libraries fall short and how this engine addresses key Fiqh requirements:
            </p>

            <div className="concept-grid">
              <div className="concept-box">
                <h4>☀️ Dahwa-e-Kubra (ضحوہ کبریٰ)</h4>
                <p>
                  <strong>The Islamic Midday.</strong> Calculated as the exact midpoint between Subh-e-Sadiq (Fajr) and Maghrib:
                  <br />
                  <code>Fajr + (Maghrib - Fajr) / 2</code>
                  <br />
                  In Fiqh Hanafi, this is the legal deadline for forming the intention (<em>Niyyah</em>) for Ramadan fasts.
                </p>
              </div>

              <div className="concept-box">
                <h4>⚠️ Makrooh Midday Window (Zawaal)</h4>
                <p>
                  Voluntary (Nafl) prayers are prohibited during solar midday. The engine calculates the exact interval
                  from <strong>Dahwa-e-Kubra $\rightarrow$ Dhuhr start</strong> so your apps can display live safety warnings.
                </p>
              </div>

              <div className="concept-box">
                <h4>⏱️ Precautionary Minutes (Ihtiat / احتیاط)</h4>
                <p>
                  Dawat-e-Islami timetables incorporate buffer minutes:
                  <br />
                  • <strong>Fajr:</strong> 2 minutes earlier to ensure Sehri ends safely.
                  <br />
                  • <strong>Maghrib:</strong> 2–3 minutes delay to guarantee sunset before Iftar.
                </p>
              </div>

              <div className="concept-box">
                <h4>⛰️ Elevation Horizon Dip (بلندی کا فرق)</h4>
                <p>
                  At higher elevations (Lahore 210m, Quetta 1,680m), the horizon dips:
                  <br />
                  • <strong>Sunrise:</strong> Occurs earlier.
                  <br />
                  • <strong>Maghrib:</strong> Occurs later.
                  <br />
                  The engine applies exact astronomical horizon depression ($\approx 0.0293 \sqrt{h}^\circ$).
                </p>
              </div>

              <div className="concept-box">
                <h4>🌙 Hijri Moon-Sighting Engine</h4>
                <p>
                  Supports physical crescent sightings (<em>Ru'yat-e-Hilal</em>) with a <code>[-2 to +2]</code> day offset,
                  Urdu/Arabic calendar names, and automatic Gyarween Sharif detection on the 11th.
                </p>
              </div>

              <div className="concept-box">
                <h4>🧭 Qibla Compass Bearing</h4>
                <p>
                  Calculates the great-circle compass bearing from any latitude/longitude coordinates directly to the Kaaba in Makkah.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Next.js Integration */}
          <div className="guide-card">
            <h3>
              <span>3. Next.js (App Router) Integration</span>
              <span className="badge-tag">Server Side & API</span>
            </h3>
            <p>Create an API endpoint at <code>app/api/prayers/route.ts</code> to serve prayer times to your frontend:</p>
            <div className="code-wrapper">
              <div className="code-header">
                <span className="code-lang">TypeScript (Next.js App Router)</span>
                <button
                  className="btn-icon"
                  style={{ padding: '2px 8px', fontSize: '11px' }}
                  onClick={() =>
                    copyCode(
                      'nextjs',
                      `import { NextResponse } from 'next/server';
import { getPrayerTimes, getHijriDate } from '@marslanmustafa/prayer-engine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '31.5204');
  const lng = parseFloat(searchParams.get('lng') || '74.3587');
  const elevation = parseFloat(searchParams.get('elevation') || '210');

  const prayers = getPrayerTimes({ latitude: lat, longitude: lng }, new Date(), {
    elevation,
    madhab: 'Hanafi',
  });

  return NextResponse.json({
    prayers,
    hijri: getHijriDate(),
  });
}`
                    )
                  }
                >
                  {copyStatus['nextjs'] || 'Copy'}
                </button>
              </div>
              <pre>{`import { NextResponse } from 'next/server';
import { getPrayerTimes, getHijriDate } from '@marslanmustafa/prayer-engine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '31.5204');
  const lng = parseFloat(searchParams.get('lng') || '74.3587');
  const elevation = parseFloat(searchParams.get('elevation') || '210');

  const prayers = getPrayerTimes({ latitude: lat, longitude: lng }, new Date(), {
    elevation,
    madhab: 'Hanafi',
  });

  return NextResponse.json({
    prayers,
    hijri: getHijriDate(),
  });
}`}</pre>
            </div>
          </div>

          {/* Section 4: React Native & Expo Integration */}
          <div className="guide-card">
            <h3>
              <span>4. React Native & Expo Integration</span>
              <span className="badge-tag">Mobile Ready</span>
            </h3>
            <p>Use with Expo Location to calculate prayer times dynamically based on GPS position:</p>
            <div className="code-wrapper">
              <div className="code-header">
                <span className="code-lang">TypeScript (React Native / Expo)</span>
                <button
                  className="btn-icon"
                  style={{ padding: '2px 8px', fontSize: '11px' }}
                  onClick={() =>
                    copyCode(
                      'rn',
                      `import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';
import { getPrayerTimes, getHijriDate } from '@marslanmustafa/prayer-engine';

export function PrayerTimesScreen() {
  const [times, setTimes] = useState(null);
  const [hijri, setHijri] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const loc = status === 'granted'
        ? await Location.getCurrentPositionAsync({})
        : { coords: { latitude: 24.8607, longitude: 67.0011 } }; // Karachi

      setTimes(getPrayerTimes({ latitude: loc.coords.latitude, longitude: loc.coords.longitude }));
      setHijri(getHijriDate());
    })();
  }, []);

  if (!times) return <Text>Loading Prayer Times...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, color: '#A1721C' }}>{hijri?.formatted.ur}</Text>
      <Text>Fajr: {times.fajr.toLocaleTimeString()}</Text>
      <Text>Dahwa-e-Kubra: {times.dahwaKubra.toLocaleTimeString()}</Text>
      <Text>Dhuhr: {times.dhuhr.toLocaleTimeString()}</Text>
      <Text>Asr (Hanafi): {times.asr.toLocaleTimeString()}</Text>
      <Text>Maghrib: {times.maghrib.toLocaleTimeString()}</Text>
      <Text>Isha: {times.isha.toLocaleTimeString()}</Text>
    </View>
  );
}`
                    )
                  }
                >
                  {copyStatus['rn'] || 'Copy'}
                </button>
              </div>
              <pre>{`import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';
import { getPrayerTimes, getHijriDate } from '@marslanmustafa/prayer-engine';

export function PrayerTimesScreen() {
  const [times, setTimes] = useState(null);
  const [hijri, setHijri] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const loc = status === 'granted'
        ? await Location.getCurrentPositionAsync({})
        : { coords: { latitude: 24.8607, longitude: 67.0011 } }; // Karachi

      setTimes(getPrayerTimes({ latitude: loc.coords.latitude, longitude: loc.coords.longitude }));
      setHijri(getHijriDate());
    })();
  }, []);

  if (!times) return <Text>Loading Prayer Times...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, color: '#A1721C' }}>{hijri?.formatted.ur}</Text>
      <Text>Fajr: {times.fajr.toLocaleTimeString()}</Text>
      <Text>Dahwa-e-Kubra: {times.dahwaKubra.toLocaleTimeString()}</Text>
      <Text>Dhuhr: {times.dhuhr.toLocaleTimeString()}</Text>
      <Text>Asr (Hanafi): {times.asr.toLocaleTimeString()}</Text>
      <Text>Maghrib: {times.maghrib.toLocaleTimeString()}</Text>
      <Text>Isha: {times.isha.toLocaleTimeString()}</Text>
    </View>
  );
}`}</pre>
            </div>
          </div>

          {/* Section 5: Full API Return Schema */}
          <div className="guide-card">
            <h3>5. API Return Signature Reference</h3>
            <p>
              Calling <code>getPrayerTimes(coords, date, options)</code> returns a rich object with all 12 times and metadata:
            </p>
            <div className="code-wrapper">
              <div className="code-header">
                <span className="code-lang">TypeScript Interface</span>
                <button
                  className="btn-icon"
                  style={{ padding: '2px 8px', fontSize: '11px' }}
                  onClick={() =>
                    copyCode(
                      'schema',
                      `interface PrayerTimesResult {
  fajr: Date;
  sunrise: Date; // adjusted for elevation dip
  ishraq: Date; // 20m after sunrise
  dahwaKubra: Date; // Islamic midday (midpoint of Fajr & Maghrib)
  makroohMidday: { start: Date; end: Date }; // Zawaal window
  dhuhr: Date;
  asr: Date; // Hanafi (2x) or Shafi (1x)
  sunset: Date; // adjusted for elevation dip
  maghrib: Date; // adjusted for elevation dip
  isha: Date;
  midnight: Date; // Islamic night midpoint
  tahajjud: Date; // Last third of night
  currentPrayer: string;
  nextPrayer: string;
  qibla: number; // compass bearing to Kaaba
  elevation: number;
  elevationShift: number; // in seconds
  adjustments: PrayerAdjustments;
}`
                    )
                  }
                >
                  {copyStatus['schema'] || 'Copy'}
                </button>
              </div>
              <pre>{`interface PrayerTimesResult {
  fajr: Date;
  sunrise: Date; // adjusted for elevation dip
  ishraq: Date; // 20m after sunrise
  dahwaKubra: Date; // Islamic midday (midpoint of Fajr & Maghrib)
  makroohMidday: { start: Date; end: Date }; // Zawaal window
  dhuhr: Date;
  asr: Date; // Hanafi (2x) or Shafi (1x)
  sunset: Date; // adjusted for elevation dip
  maghrib: Date; // adjusted for elevation dip
  isha: Date;
  midnight: Date; // Islamic night midpoint
  tahajjud: Date; // Last third of night
  currentPrayer: string;
  nextPrayer: string;
  qibla: number; // compass bearing to Kaaba
  elevation: number;
  elevationShift: number; // in seconds
  adjustments: PrayerAdjustments;
}`}</pre>
            </div>
          </div>
        </div>
      )}

      <footer>
        <p>
          <strong>@marslanmustafa/prayer-engine</strong> &bull; MIT License &bull; Calibrated for Dawat-e-Islami
        </p>
      </footer>
    </div>
  );
}
