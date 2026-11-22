# @marslanmustafa/prayer-engine

> **Universal Islamic prayer times, Dahwa-e-Kubra, Qibla compass, and Hijri moon-sighting engine with multi-school support (Hanafi, Shafi'i, Karachi, MWL, Umm al-Qura).**
> Compatible with **React Native (Expo & Bare)**, **Next.js (App & Pages Router)**, **Vite**, and **Node.js**.

[![npm version](https://img.shields.io/npm/v/@marslanmustafa/prayer-engine.svg)](https://www.npmjs.com/package/@marslanmustafa/prayer-engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

---

## Table of Contents

- [Why This Engine?](#why-this-engine)
- [Key Features](#key-features)
- [Installation](#installation)
- [Quick Start Guide](#quick-start-guide)
- [Essential Fiqh Timetable Features](#essential-fiqh-timetable-features)
  - [1. Dahwa-e-Kubra (ضحوہ کبریٰ) & Makrooh Midday (Zawaal)](#1-dahwa-e-kubra-ضحوہ-کبری-and-makrooh-midday-zawaal)
  - [2. Ishraq & Tahajjud](#2-ishraq-and-tahajjud)
  - [3. Precautionary Adjustments (Ihtiat / احتیاط)](#3-precautionary-adjustments-ihtiat--احتیاط)
  - [4. Elevation Horizon Dip Correction (بلندی / ارتفاع)](#4-elevation-horizon-dip-correction-بلندی--ارتفاع)
- [Hijri Moon-Sighting Engine](#hijri-moon-sighting-engine)
- [Qibla Direction](#qibla-direction)
- [Integration Guides](#integration-guides)
  - [Next.js (App Router)](#nextjs-app-router)
  - [React Native & Expo](#react-native--expo)
  - [Node.js Backend / Cron](#nodejs-backend--cron)
- [Interactive Web Playground](#interactive-web-playground)
- [API Reference](#api-reference)
- [License](#license)

---

## Why This Engine?

Standard prayer time libraries often calculate only raw astronomical times (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha). 

However, in authentic Islamic jurisprudence (Fiqh Hanafi & multi-school practices), several critical times are needed for daily religious practice:
1. **Dahwa-e-Kubra (Islamic Midday)**: Essential for determining the deadline for fasting intention (*Niyyah*) during Ramadan and voluntary fasts.
2. **Makrooh Midday Window (Zawaal)**: The prohibited period between Dahwa-e-Kubra and Dhuhr when offering voluntary (Nafl) prayers and Sajdah is forbidden.
3. **Ishraq**: 20 minutes post-sunrise prayer time.
4. **Precautionary Minutes (*Ihtiat*)**: Sehri safety buffer (ending 2-3 mins before true dawn) and Iftar safety buffer (waiting 2-3 mins after sunset).
5. **Elevation Correction**: Ground altitude above sea level causes the horizon to dip, making sunrise occur earlier and sunset occur later.
6. **Physical Moon Sighting (*Ru'yat-e-Hilal*)**: Astronomical tabular calendars frequently differ from local crescent sightings by $\pm 1$ or $2$ days.

`@marslanmustafa/prayer-engine` builds all of these features into one lightweight, zero-dependency engine.

---

## Key Features

- ⏱ **Universal & Multi-School**: Pre-configured with the Karachi method, Hanafi Asr (2x shadow), Shafi'i support (1x shadow), raw solar noon, and elevation support.
- ☀️ **Complete 12-Time Daily Schedule**:
  - `fajr`, `sunrise`, `ishraq`, `dahwaKubra`, `makroohMidday`, `dhuhr`, `asr`, `sunset`, `maghrib`, `isha`, `midnight`, `tahajjud`.
- ⚠️ **Makrooh Midday Window**: Explicit start (`dahwaKubra`) and end (`dhuhr`) bounds to guard against invalid prayer times.
- ⛰️ **Elevation Horizon Dip**: Astronomical formula for atmospheric dip at higher elevations.
- 🌙 **Ruet-e-Hilal Moon-Sighting Engine**: Offline tabular fallback + modern `Intl` Umm al-Qura, with `[-2, -1, 0, +1, +2]` day offsets, Urdu/Arabic names, and Gyarween Sharif detection on the 11th.
- 🧭 **Kaaba Qibla Bearing**: Accurate compass bearing from any coordinates.
- 📱 **Framework Ready**: Dual ESM & CJS builds with complete TypeScript declarations.

---

## Installation

```bash
npm install @marslanmustafa/prayer-engine
# or
yarn add @marslanmustafa/prayer-engine
# or
pnpm add @marslanmustafa/prayer-engine
```

---

## Quick Start Guide

### Basic 30-Second Example

```typescript
import { getPrayerTimes } from '@marslanmustafa/prayer-engine';

// Coordinates for Lahore
const coords = { latitude: 31.5204, longitude: 74.3587 };

// Calculates today's times using standard defaults (Karachi + Hanafi)
const prayers = getPrayerTimes(coords, new Date());

console.log('Fajr (Sehri Ends):', prayers.fajr.toLocaleTimeString());
console.log('Sunrise:', prayers.sunrise.toLocaleTimeString());
console.log('Ishraq:', prayers.ishraq.toLocaleTimeString());
console.log('Dahwa-e-Kubra (Islamic Midday):', prayers.dahwaKubra.toLocaleTimeString());
console.log('Makrooh Midday Window:', prayers.makroohMidday);
console.log('Dhuhr:', prayers.dhuhr.toLocaleTimeString());
console.log('Asr (Hanafi):', prayers.asr.toLocaleTimeString());
console.log('Maghrib (Iftar):', prayers.maghrib.toLocaleTimeString());
console.log('Isha:', prayers.isha.toLocaleTimeString());
console.log('Islamic Midnight:', prayers.midnight.toLocaleTimeString());
console.log('Tahajjud Time:', prayers.tahajjud.toLocaleTimeString());
console.log('Qibla Compass Bearing:', prayers.qibla.toFixed(1) + '°');
```

---

## Essential Fiqh Timetable Features

### 1. Dahwa-e-Kubra (ضحوہ کبریٰ) & Makrooh Midday (Zawaal)

In Islamic law:
* **The Islamic Day** begins at Subh-e-Sadiq (Fajr) and ends at Sunset (Maghrib).
* **Dahwa-e-Kubra** is the exact mathematical halfway point between Fajr and Maghrib:
  $$\text{Dahwa-e-Kubra} = \text{Fajr} + \frac{\text{Maghrib} - \text{Fajr}}{2}$$
* **Why it matters:**
  1. **Fasting Intention (*Niyyah*)**: During Ramadan and voluntary fasts, the intention must be formed before Dahwa-e-Kubra.
  2. **Makrooh Window Start**: Dahwa-e-Kubra marks the beginning of the midday prohibited prayer window (*Zawaal*), which ends when Dhuhr begins.

```typescript
const prayers = getPrayerTimes(coords);

console.log('Dahwa-e-Kubra:', prayers.dahwaKubra);
console.log('Makrooh Window Start:', prayers.makroohMidday.start);
console.log('Makrooh Window End:', prayers.makroohMidday.end);

// Guard check for voluntary prayer
const now = new Date();
const isMakrooh = now >= prayers.makroohMidday.start && now < prayers.makroohMidday.end;
if (isMakrooh) {
  console.warn('Voluntary prayers are prohibited during Makrooh Midday!');
}
```

---

### 2. Ishraq and Tahajjud

* **Ishraq**: Recommended voluntary prayer 20 minutes after sunrise.
* **Islamic Midnight**: Mathematical midpoint between Maghrib and next morning's Fajr.
* **Tahajjud**: Begins during the last third of the Islamic night.

```typescript
const prayers = getPrayerTimes(coords);

console.log('Ishraq (20m post-sunrise):', prayers.ishraq);
console.log('Tahajjud (last third of night begins):', prayers.tahajjud);
```

---

### 3. Precautionary Adjustments (Ihtiat / احتیاط)

Traditional timetables include precautionary buffer minutes to account for horizon variation:
* **Fajr**: 2 minutes early for Sehri end safety.
* **Maghrib**: 2–3 minutes delay for Iftar sunset safety.

```typescript
const prayers = getPrayerTimes(coords, new Date(), {
  adjustments: {
    fajr: -2,   // 2 minutes earlier
    maghrib: 3, // 3 minutes later
  },
});
```

---

### 4. Elevation Horizon Dip Correction (بلندی / ارتفاع)

At higher altitudes (e.g. Lahore at 210m, Islamabad at 540m, Quetta at 1,680m), the observer's horizon dips:
* **Sunrise happens earlier** (negative shift).
* **Sunset/Maghrib happens later** (positive shift).

The engine applies exact astronomical horizon depression correction:

```typescript
const prayers = getPrayerTimes(
  { latitude: 31.5204, longitude: 74.3587 }, // Lahore
  new Date(),
  { elevation: 210 } // 210m elevation shifts sunrise 130s earlier & maghrib 130s later
);

console.log('Elevation shift applied (seconds):', prayers.elevationShift);
```

---

## Hijri Moon-Sighting Engine

The lunar calendar relies on local crescent sightings (*Ru'yat-e-Hilal*). The engine provides offline tabular calculation with fallback to modern `Intl` Umm al-Qura, and includes a **moon sighting adjustment offset** (`-2` to `+2` days):

```typescript
import { getHijriDate } from '@marslanmustafa/prayer-engine';

// Standard Hijri date
const hijri = getHijriDate(new Date());

console.log(hijri.formatted.en); // "12 Jumada al-Thani 1448 AH"
console.log(hijri.formatted.ur); // "12 جمادی الآخرہ 1448ھ"
console.log(hijri.formatted.ar); // "12 جُمَادَى الآخِرَة 1448 هـ"
console.log(hijri.dayOfWeek.ur); // "اتوار"

// Local Ruet-e-Hilal adjustment (e.g. Pakistan sighted crescent 1 day later)
const adjusted = getHijriDate(new Date(), { adjustment: -1 });

// Check for Gyarween Sharif (11th of every month)
if (hijri.isGyarweenSharif) {
  console.log('Today is Gyarween Sharif (گیارہویں شریف)!');
}

// Check for notable Islamic events (Mawlid un-Nabi, Ashura, Shab-e-Barat, etc.)
if (hijri.events.length > 0) {
  console.log('Special Occasion:', hijri.events[0].name, hijri.events[0].nameUrdu);
}
```

---

## Qibla Direction

Calculates the exact great-circle compass bearing towards the Holy Kaaba in Makkah ($21.4225^\circ\text{ N}, 39.8262^\circ\text{ E}$):

```typescript
import { getPrayerTimes, Coordinates, Qibla } from '@marslanmustafa/prayer-engine';

const coords = new Coordinates(24.8607, 67.0011); // Karachi

// Via prayer times:
const prayers = getPrayerTimes(coords);
console.log('Qibla angle:', prayers.qibla.toFixed(2) + '°');

// Or standalone:
const bearing = Qibla(coords);
console.log('Kaaba Bearing:', bearing);
```

---

## Integration Guides

### Next.js (App Router)

Create an API Route at `app/api/prayer-times/route.ts`:

```typescript
import { NextResponse } from 'next/server';
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

  const hijri = getHijriDate();

  return NextResponse.json({
    timings: {
      fajr: prayers.fajr,
      sunrise: prayers.sunrise,
      ishraq: prayers.ishraq,
      dahwaKubra: prayers.dahwaKubra,
      dhuhr: prayers.dhuhr,
      asr: prayers.asr,
      maghrib: prayers.maghrib,
      isha: prayers.isha,
      midnight: prayers.midnight,
      tahajjud: prayers.tahajjud,
    },
    hijri,
    qibla: prayers.qibla,
  });
}
```

---

### React Native & Expo

Works directly with Metro bundler and Hermes with zero extra polyfills:

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { getPrayerTimes, getHijriDate } from '@marslanmustafa/prayer-engine';

export default function PrayerWidget() {
  const [prayers, setPrayers] = useState(null);
  const [hijri, setHijri] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const loc = status === 'granted' 
        ? await Location.getCurrentPositionAsync({})
        : { coords: { latitude: 24.8607, longitude: 67.0011 } }; // Karachi fallback

      const times = getPrayerTimes({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      setPrayers(times);
      setHijri(getHijriDate());
    })();
  }, []);

  if (!prayers) return <Text>Loading Prayer Times...</Text>;

  return (
    <View style={styles.card}>
      <Text style={styles.hijriText}>{hijri?.formatted.ur}</Text>
      <Text>Fajr: {prayers.fajr.toLocaleTimeString()}</Text>
      <Text>Dahwa-e-Kubra: {prayers.dahwaKubra.toLocaleTimeString()}</Text>
      <Text>Dhuhr: {prayers.dhuhr.toLocaleTimeString()}</Text>
      <Text>Asr (Hanafi): {prayers.asr.toLocaleTimeString()}</Text>
      <Text>Maghrib: {prayers.maghrib.toLocaleTimeString()}</Text>
      <Text>Isha: {prayers.isha.toLocaleTimeString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#fff', borderRadius: 12 },
  hijriText: { fontSize: 18, color: '#A1721C', marginBottom: 8 },
});
```

---

### Node.js Backend / Cron

Run scheduled Adhan notifications or daily prayer sync scripts:

```javascript
const { getPrayerTimes, getHijriDate } = require('@marslanmustafa/prayer-engine');

function checkPrayerTimes() {
  const times = getPrayerTimes({ latitude: 31.5204, longitude: 74.3587 }, new Date(), {
    elevation: 210,
    madhab: 'Hanafi',
  });

  console.log(`Today's Fajr: ${times.fajr.toLocaleTimeString()}`);
  console.log(`Dahwa-e-Kubra: ${times.dahwaKubra.toLocaleTimeString()}`);
}

checkPrayerTimes();
```

---

## Interactive Web Playground & Developer Guide

This repository includes a standalone, zero-dependency **Green & White** interactive web application (`index.html`) that works out of the box:
- **No dev server required**: Simply double-click `index.html` in your file browser (or run `open index.html` on macOS) to test immediately in Chrome, Safari, Edge, or Firefox.
- **Clean Green & White Design**: Minimalist, high-readability Islamic aesthetic with simple SVG icons and zero heavy theme paint.
- **Includes 2 Built-In Views**:
  1. **🕌 Live Prayer Times**: One-tap city presets, live countdown ticker, Hijri date with moon sighting adjustment (`-1d`, `0`, `+1d`), Makrooh Midday warning banner, 12-time daily schedule with Urdu names, Qibla compass bearing, and collapsible Ihtiat settings.
  2. **📖 Library Guide & Documentation**: Interactive developer guide explaining Dahwa-e-Kubra, Makrooh Midday, Ihtiat buffers, elevation dip, and copy-pasteable snippets for Next.js, React Native, and Node.js.

### Deploy to Vercel

The project is pre-configured with `vercel.json` for 1-click deployment:
1. Push this repo to GitHub.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Vercel automatically deploys the static site in seconds!

---

## API Reference

### `getPrayerTimes(coords, date?, options?): PrayerTimesResult`

#### Arguments:
* `coords`: `{ latitude: number, longitude: number }` or `new Coordinates(lat, lng)`
* `date`: `Date` (defaults to current date)
* `options`: `CalculationParameters` OR `PrayerCalculationOptions`:
  * `method`: `'Karachi'` | `'MuslimWorldLeague'` | `'UmmAlQura'` | `'Egyptian'` | `'NorthAmerica'` | `'MoonsightingCommittee'` | `'Turkey'` | `'Other'`
  * `madhab`: `'Hanafi'` | `'Shafi'`
  * `elevation`: `number` (elevation above sea level in meters)
  * `rounding`: `'None'` (seconds precision) | `'Nearest'` (minutes precision)
  * `dhuhrMargin`: `'none'` (raw solar noon) | `'method'` (+1 min)
  * `highLatitudeRule`: `'auto'` | `'MiddleOfTheNight'` | `'SeventhOfTheNight'` | `'TwilightAngle'`
  * `adjustments`: `{ fajr?: number, sunrise?: number, dhuhr?: number, asr?: number, maghrib?: number, isha?: number }`

#### Returns (`PrayerTimesResult`):
* `fajr`: `Date`
* `sunrise`: `Date` (adjusted for elevation dip)
* `ishraq`: `Date` (20 mins post-sunrise)
* `dahwaKubra`: `Date` (exact midpoint between Fajr and Maghrib)
* `makroohMidday`: `{ start: Date, end: Date }` (Dahwa-e-Kubra to Dhuhr)
* `dhuhr`: `Date`
* `asr`: `Date` (Hanafi 2x shadow or Shafi 1x shadow)
* `sunset`: `Date` (adjusted for elevation dip)
* `maghrib`: `Date` (adjusted for elevation dip)
* `isha`: `Date`
* `midnight`: `Date` (Islamic night midpoint)
* `tahajjud`: `Date` (last third of night begins)
* `currentPrayer`: `'none' | 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'`
* `nextPrayer`: `'none' | 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'`
* `qibla`: `number` (compass bearing in degrees)
* `elevation`: `number` (meters applied)
* `elevationShift`: `number` (seconds shifted)
* `adjustments`: `PrayerAdjustments`
* `raw`: `PrayerTimes` (raw underlying Adhan instance)

---

### `getHijriDate(date?, options?): HijriDateResult`

#### Arguments:
* `date`: `Date` (defaults to current date)
* `options`: `number` (offset in days) or `{ adjustment?: number, method?: 'auto' | 'tabular' }`

#### Returns (`HijriDateResult`):
* `day`: `number` (1–30)
* `month`: `{ number: number, en: string, ur: string, ar: string }`
* `year`: `number` (e.g. 1448)
* `dayOfWeek`: `{ en: string, ur: string, ar: string }`
* `formatted`: `{ en: string, ur: string, ar: string }`
* `adjustment`: `number` (moon sighting offset applied)
* `isGyarweenSharif`: `boolean` (true if `day === 11`)
* `events`: `IslamicEvent[]` (matched historical events)

---

## License

MIT License &copy; [Arslan Mustafa](https://github.com/marslanmustafa)
