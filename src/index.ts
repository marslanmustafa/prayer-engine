import {
  CalculationMethod,
  CalculationParameters,
  Coordinates,
  HighLatitudeRule,
  Madhab,
  PolarCircleResolution,
  Prayer,
  PrayerTimes,
  Qibla,
  Rounding,
  Shafaq,
  SunnahTimes,
} from 'adhan';

// Re-export all core types and classes from adhan
export {
  CalculationMethod,
  CalculationParameters,
  Coordinates,
  HighLatitudeRule,
  PolarCircleResolution,
  Prayer,
  PrayerTimes,
  Qibla,
  Rounding,
  Shafaq,
  SunnahTimes,
};

/**
 * Coordinate input type allowing either Adhan's Coordinates instance or a plain object.
 */
export type CoordinatesInput =
  | Coordinates
  | { latitude: number; longitude: number };

/**
 * Per-prayer precautionary / ihtiat adjustments in minutes.
 */
export interface PrayerAdjustments {
  fajr?: number;
  sunrise?: number;
  dhuhr?: number;
  asr?: number;
  maghrib?: number;
  isha?: number;
}

export type MadhabValue =
  | (typeof Madhab)[keyof typeof Madhab]
  | 'Hanafi'
  | 'Shafi';

export type RoundingValue =
  | (typeof Rounding)[keyof typeof Rounding]
  | 'Nearest'
  | 'Up'
  | 'None';

export type HighLatitudeRuleValue =
  | 'auto'
  | 'middleofthenight'
  | 'seventhofthenight'
  | 'twilightangle'
  | 'MiddleOfTheNight'
  | 'SeventhOfTheNight'
  | 'TwilightAngle';

/**
 * Comprehensive calculation options for getPrayerTimes.
 */
export interface PrayerCalculationOptions {
  date?: Date;
  /**
   * Pre-configured CalculationParameters or method name.
   */
  params?: CalculationParameters;
  method?:
    | 'Karachi'
    | 'MuslimWorldLeague'
    | 'Egyptian'
    | 'UmmAlQura'
    | 'Dubai'
    | 'MoonsightingCommittee'
    | 'NorthAmerica'
    | 'Kuwait'
    | 'Qatar'
    | 'Singapore'
    | 'Tehran'
    | 'Turkey'
    | 'Other'
    | string;
  madhab?: MadhabValue;
  /**
   * Elevation above sea level in meters.
   * Due to atmospheric dip of the horizon, higher elevations see sunrise earlier
   * and sunset/Maghrib later. The engine applies exact astronomical dip correction.
   */
  elevation?: number;
  /**
   * Precision rounding:
   * - Rounding.None or 'None': Exact seconds
   * - Rounding.Nearest or 'Nearest': Rounded to nearest minute
   */
  rounding?: RoundingValue;
  /**
   * Dhuhr margin:
   * - 'method': Uses calculation method default (+1 minute in Karachi method)
   * - 'none': Uses raw solar noon (0 minute margin)
   */
  dhuhrMargin?: 'method' | 'none';
  /**
   * High latitude adjustment rule:
   * - 'auto': Uses HighLatitudeRule.recommended(coordinates)
   * - Or specific HighLatitudeRule enum / name
   */
  highLatitudeRule?: HighLatitudeRuleValue;
  /**
   * Custom angles when method is 'Other'.
   */
  fajrAngle?: number;
  ishaAngle?: number;
  /**
   * Precautionary (Ihtiat / احتیاط) adjustments in minutes.
   */
  adjustments?: PrayerAdjustments;
}

/**
 * Result structure returned by getPrayerTimes().
 */
export interface PrayerTimesResult {
  fajr: Date;
  sunrise: Date;
  ishraq: Date;
  dahwaKubra: Date;
  makroohMidday: {
    start: Date;
    end: Date;
  };
  dhuhr: Date;
  asr: Date;
  sunset: Date;
  maghrib: Date;
  isha: Date;
  midnight: Date;
  tahajjud: Date;
  currentPrayer: 'none' | 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nextPrayer: 'none' | 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  qibla: number;
  elevation: number;
  elevationShift: number; // in seconds applied to sunrise and maghrib
  adjustments: PrayerAdjustments;
  raw: PrayerTimes;
}

/**
 * Astronomical calculation of the horizon dip due to elevation above sea level.
 * Shifts sunrise earlier and sunset/Maghrib later.
 *
 * @param lat Latitude in degrees
 * @param date Target date
 * @param elevationMeters Elevation above sea level in meters
 * @returns Shift duration in seconds (0 if elevation is 0)
 */
export function getElevationShift(
  lat: number,
  date: Date,
  elevationMeters: number
): number {
  if (!elevationMeters || elevationMeters <= 0) return 0;
  const R = Math.PI / 180;
  const d0 = date;
  const N = Math.round(
    (d0.getTime() - new Date(d0.getFullYear(), 0, 0).getTime()) / 864e5
  );
  const dec = -Math.asin(
    0.39779 *
      Math.cos(
        R * (0.98565 * (N + 10) + 1.914 * Math.sin(R * 0.98565 * (N - 2)))
      )
  );
  const phi = lat * R;

  function H(alt: number): number {
    const c =
      (Math.sin(-alt * R) - Math.sin(phi) * Math.sin(dec)) /
      (Math.cos(phi) * Math.cos(dec));
    return Math.abs(c) > 1 ? NaN : (Math.acos(c) / R / 15) * 3600;
  }

  // 0.8333° standard atmospheric refraction + solar semi-diameter; 0.0293 * sqrt(elev) dip
  const dt = H(0.8333 + 0.0293 * Math.sqrt(elevationMeters)) - H(0.8333);
  return isNaN(dt) ? 0 : dt;
}

/**
 * Get default calculation parameters:
 * - Method: Karachi (University of Islamic Sciences, Karachi)
 * - Madhab: Hanafi (standard for South Asia and worldwide Hanafi communities)
 * - Precision: Rounding.None (Exact seconds)
 * - Dhuhr margin: none (raw solar noon, 0 min margin)
 */
export function getDefaultParameters(
  options?: Partial<PrayerCalculationOptions>
): CalculationParameters {
  const params = CalculationMethod.Karachi();
  params.madhab = Madhab.Hanafi;
  params.rounding = Rounding.None;
  if (options?.dhuhrMargin === 'none' || options?.dhuhrMargin === undefined) {
    params.methodAdjustments = Object.assign({}, params.methodAdjustments, {
      dhuhr: 0,
    });
  }

  if (options?.adjustments) {
    if (options.adjustments.fajr !== undefined)
      params.adjustments.fajr = options.adjustments.fajr;
    if (options.adjustments.sunrise !== undefined)
      params.adjustments.sunrise = options.adjustments.sunrise;
    if (options.adjustments.dhuhr !== undefined)
      params.adjustments.dhuhr = options.adjustments.dhuhr;
    if (options.adjustments.asr !== undefined)
      params.adjustments.asr = options.adjustments.asr;
    if (options.adjustments.maghrib !== undefined)
      params.adjustments.maghrib = options.adjustments.maghrib;
    if (options.adjustments.isha !== undefined)
      params.adjustments.isha = options.adjustments.isha;
  }

  return params;
}

/**
 * Backwards-compatible alias for getDefaultParameters().
 */
export const getDawatEIslamiParameters = getDefaultParameters;

/**
 * Calculate universal prayer times with Dahwa-e-Kubra, Makrooh Midday window,
 * Ishraq, Tahajjud, elevation shift, and precautionary (Ihtiat) adjustments.
 *
 * @param coords Geographic coordinates (Coordinates instance or { latitude, longitude })
 * @param date Target date (defaults to current date)
 * @param optionsOrParams CalculationParameters OR PrayerCalculationOptions configuration
 */
export function getPrayerTimes(
  coords: CoordinatesInput,
  date: Date = new Date(),
  optionsOrParams?: CalculationParameters | PrayerCalculationOptions
): PrayerTimesResult {
  const coordinates =
    coords instanceof Coordinates
      ? coords
      : new Coordinates(coords.latitude, coords.longitude);

  let params: CalculationParameters;
  let elevation = 0;
  let userAdjustments: PrayerAdjustments = {};

  if (optionsOrParams instanceof CalculationParameters) {
    params = optionsOrParams;
  } else if (optionsOrParams && typeof optionsOrParams === 'object') {
    const opts = optionsOrParams as PrayerCalculationOptions;
    elevation = Math.max(0, opts.elevation || 0);

    if (opts.params) {
      params = opts.params;
    } else {
      const methodKey = opts.method || 'Karachi';
      if (typeof (CalculationMethod as any)[methodKey] === 'function') {
        params = (CalculationMethod as any)[methodKey]();
      } else {
        params = CalculationMethod.Karachi();
      }

      if (methodKey === 'Other') {
        if (opts.fajrAngle !== undefined) params.fajrAngle = opts.fajrAngle;
        if (opts.ishaAngle !== undefined) params.ishaAngle = opts.ishaAngle;
      }
    }

    // Madhab
    if (opts.madhab) {
      params.madhab =
        opts.madhab === 'Hanafi' || opts.madhab === Madhab.Hanafi
          ? Madhab.Hanafi
          : Madhab.Shafi;
    } else if (!opts.params) {
      params.madhab = Madhab.Hanafi; // Default
    }

    // Precision Rounding
    if (opts.rounding) {
      params.rounding =
        opts.rounding === 'None' || opts.rounding === Rounding.None
          ? Rounding.None
          : Rounding.Nearest;
    }

    // Dhuhr Margin
    if (opts.dhuhrMargin === 'none') {
      params.methodAdjustments = Object.assign({}, params.methodAdjustments, {
        dhuhr: 0,
      });
    }

    // High Latitude Rule
    if (opts.highLatitudeRule) {
      if (opts.highLatitudeRule === 'auto') {
        params.highLatitudeRule = HighLatitudeRule.recommended(coordinates);
      } else if (typeof opts.highLatitudeRule === 'string') {
        params.highLatitudeRule =
          (HighLatitudeRule as any)[opts.highLatitudeRule] ||
          HighLatitudeRule.recommended(coordinates);
      } else {
        params.highLatitudeRule = opts.highLatitudeRule;
      }
    }

    // Precautionary / Ihtiat Adjustments
    if (opts.adjustments) {
      userAdjustments = opts.adjustments;
      if (opts.adjustments.fajr !== undefined)
        params.adjustments.fajr = opts.adjustments.fajr;
      if (opts.adjustments.sunrise !== undefined)
        params.adjustments.sunrise = opts.adjustments.sunrise;
      if (opts.adjustments.dhuhr !== undefined)
        params.adjustments.dhuhr = opts.adjustments.dhuhr;
      if (opts.adjustments.asr !== undefined)
        params.adjustments.asr = opts.adjustments.asr;
      if (opts.adjustments.maghrib !== undefined)
        params.adjustments.maghrib = opts.adjustments.maghrib;
      if (opts.adjustments.isha !== undefined)
        params.adjustments.isha = opts.adjustments.isha;
    }
  } else {
    // Default parameters (Karachi + Hanafi)
    params = getDefaultParameters();
  }

  // Astronomical elevation dip shift (seconds)
  const elevShiftSeconds = getElevationShift(
    coordinates.latitude,
    date,
    elevation
  );

  const pt = new PrayerTimes(coordinates, date, params);

  // Apply elevation shift to sunrise (earlier) and sunset/maghrib (later)
  const sunrise = elevShiftSeconds
    ? new Date(pt.sunrise.getTime() - elevShiftSeconds * 1000)
    : pt.sunrise;
  const sunset = elevShiftSeconds
    ? new Date(pt.sunset.getTime() + elevShiftSeconds * 1000)
    : pt.sunset;
  const maghrib = elevShiftSeconds
    ? new Date(pt.maghrib.getTime() + elevShiftSeconds * 1000)
    : pt.maghrib;

  // Dahwa-e-Kubra (Islamic midday): exact midpoint between Fajr and Maghrib
  const dahwaKubra = new Date(
    pt.fajr.getTime() + (maghrib.getTime() - pt.fajr.getTime()) / 2
  );

  // Ishraq: 20 minutes after Sunrise
  const ishraq = new Date(sunrise.getTime() + 20 * 60 * 1000);

  // Makrooh Midday Window: Dahwa-e-Kubra -> Dhuhr
  const makroohMidday = { start: dahwaKubra, end: pt.dhuhr };

  // Midnight (Islamic): midpoint between Maghrib and next Fajr (approx. +24h Fajr)
  const nextFajr = new PrayerTimes(
    coordinates,
    new Date(date.getTime() + 86400000),
    params
  ).fajr;
  const nightDuration = nextFajr.getTime() - maghrib.getTime();
  const midnight = new Date(maghrib.getTime() + nightDuration / 2);
  const tahajjud = new Date(maghrib.getTime() + (nightDuration * 2) / 3); // Last third of night

  return {
    fajr: pt.fajr,
    sunrise,
    ishraq,
    dahwaKubra,
    makroohMidday,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    sunset,
    maghrib,
    isha: pt.isha,
    midnight,
    tahajjud,
    currentPrayer: pt.currentPrayer(date),
    nextPrayer: pt.nextPrayer(date),
    qibla: Qibla(coordinates),
    elevation,
    elevationShift: elevShiftSeconds,
    adjustments: userAdjustments,
    raw: pt,
  };
}

/**
 * Hijri Month definition.
 */
export interface HijriMonth {
  number: number;
  en: string;
  ur: string;
  ar: string;
}

export const HIJRI_MONTHS: readonly HijriMonth[] = [
  { number: 1, en: 'Muharram', ur: 'محرم الحرام', ar: 'مُحَرَّم' },
  { number: 2, en: 'Safar', ur: 'صفر المظفر', ar: 'صَفَر' },
  { number: 3, en: "Rabi' al-Awwal", ur: 'ربیع الاول', ar: 'رَبِيع الأَوَّل' },
  { number: 4, en: "Rabi' al-Thani", ur: 'ربیع الآخر', ar: 'رَبِيع الآخِر' },
  { number: 5, en: 'Jumada al-Awwal', ur: 'جمادی الاولیٰ', ar: 'جُمَادَى الأُولَى' },
  { number: 6, en: 'Jumada al-Thani', ur: 'جمادی الآخرہ', ar: 'جُمَادَى الآخِرَة' },
  { number: 7, en: 'Rajab', ur: 'رجب المرجب', ar: 'رَجَب' },
  { number: 8, en: "Sha'ban", ur: 'شعبان المعظم', ar: 'شَعْبَان' },
  { number: 9, en: 'Ramadan', ur: 'رمضان المبارک', ar: 'رَمَضَان' },
  { number: 10, en: 'Shawwal', ur: 'شوال المکرم', ar: 'شَوَّال' },
  { number: 11, en: "Dhu al-Qi'dah", ur: 'ذوالقعدۃ الحرام', ar: 'ذُو القَعْدَة' },
  { number: 12, en: 'Dhu al-Hijjah', ur: 'ذوالحجۃ الحرام', ar: 'ذُو الحِجَّة' },
];

/**
 * Islamic Event information.
 */
export interface IslamicEvent {
  name: string;
  nameUrdu: string;
  nameArabic: string;
  hijriMonth: number;
  hijriDay: number;
  description?: string;
}

export const NOTABLE_ISLAMIC_EVENTS: readonly IslamicEvent[] = [
  {
    name: 'Islamic New Year',
    nameUrdu: 'نیا اسلامی سال',
    nameArabic: 'رأس السنة الهجرية',
    hijriMonth: 1,
    hijriDay: 1,
  },
  {
    name: 'Day of Ashura',
    nameUrdu: 'یوم عاشوراء (شہادت امام حسین رض)',
    nameArabic: 'يَوْم عَاشُورَاء',
    hijriMonth: 1,
    hijriDay: 10,
  },
  {
    name: 'Urs-e-Ala Hazrat',
    nameUrdu: 'عرس اعلیٰ حضرت امام احمد رضا خان رحمۃ اللہ علیہ',
    nameArabic: 'عرس الإمام أحمد رضا خان',
    hijriMonth: 2,
    hijriDay: 25,
  },
  {
    name: 'Mawlid un-Nabi ﷺ (Eid Milad-un-Nabi)',
    nameUrdu: 'ولادت با سعادت حضور سرورِ کائنات ﷺ',
    nameArabic: 'المولد النبوي الشريف',
    hijriMonth: 3,
    hijriDay: 12,
  },
  {
    name: 'Gyarween Sharif (Ghaus-ul-Azam)',
    nameUrdu: 'گیارہویں شریف (عرس حضور غوث الاعظم شیخ عبدالقادر جیلانی)',
    nameArabic: 'الحادي عشر الشريف (الشيخ عبد القادر الجيلاني)',
    hijriMonth: 4,
    hijriDay: 11,
  },
  {
    name: "Shab-e-Mi'raj",
    nameUrdu: 'شب معراج النبی ﷺ',
    nameArabic: 'الإسراء والمعراج',
    hijriMonth: 7,
    hijriDay: 27,
  },
  {
    name: 'Shab-e-Barat',
    nameUrdu: 'شب برأت (لیلۃ البراءۃ)',
    nameArabic: 'ليلة البراءة',
    hijriMonth: 8,
    hijriDay: 15,
  },
  {
    name: 'First Day of Ramadan',
    nameUrdu: 'یکم رمضان المبارک',
    nameArabic: 'أول رمضان المبارك',
    hijriMonth: 9,
    hijriDay: 1,
  },
  {
    name: 'Shahadat-e-Mawla Ali Murtaza (R.A)',
    nameUrdu: 'شہادت امیر المومنین سیدنا علی المرتضیٰ کرم اللہ وجہہ',
    nameArabic: 'استشهاد الإمام علي بن أبي طالب',
    hijriMonth: 9,
    hijriDay: 21,
  },
  {
    name: 'Shab-e-Qadr (Laylat al-Qadr)',
    nameUrdu: 'شب قدر (لیلۃ القدر)',
    nameArabic: 'ليلة القدر',
    hijriMonth: 9,
    hijriDay: 27,
  },
  {
    name: 'Eid al-Fitr',
    nameUrdu: 'عید الفطر',
    nameArabic: 'عيد الفطر المبارك',
    hijriMonth: 10,
    hijriDay: 1,
  },
  {
    name: 'Day of Arafah (Hajj)',
    nameUrdu: 'یوم عرفہ (حج کا دن)',
    nameArabic: 'يوم عرفة',
    hijriMonth: 12,
    hijriDay: 9,
  },
  {
    name: 'Eid al-Adha',
    nameUrdu: 'عید الاضحیٰ',
    nameArabic: 'عيد الأضحى المبارك',
    hijriMonth: 12,
    hijriDay: 10,
  },
];

/**
 * Result structure of Hijri date computation.
 */
export interface HijriDateResult {
  day: number;
  month: HijriMonth;
  year: number;
  dayOfWeek: {
    en: string;
    ur: string;
    ar: string;
  };
  formatted: {
    en: string;
    ur: string;
    ar: string;
  };
  adjustment: number;
  events: IslamicEvent[];
  isGyarweenSharif: boolean;
}

export interface HijriDateOptions {
  /**
   * Moon sighting adjustment in days (-2 to +2).
   * Local Ru'yat-e-Hilal committees may differ from the
   * astronomical calculation by +/- 1 or 2 days depending on physical moon sightings.
   */
  adjustment?: number;
  /**
   * Computation method:
   * - 'auto': Uses Intl with Umm al-Qura if available, falling back to tabular algorithm
   * - 'tabular': Uses deterministic astronomical tabular algorithm
   */
  method?: 'auto' | 'tabular';
}

const DAYS_OF_WEEK = [
  { en: 'Sunday', ur: 'اتوار', ar: 'الأحد' },
  { en: 'Monday', ur: 'پیر', ar: 'الإثنين' },
  { en: 'Tuesday', ur: 'منگل', ar: 'الثلاثاء' },
  { en: 'Wednesday', ur: 'بدھ', ar: 'الأربعاء' },
  { en: 'Thursday', ur: 'جمعرات', ar: 'الخميس' },
  { en: 'Friday', ur: 'جمعہ', ar: 'الجمعة' },
  { en: 'Saturday', ur: 'ہفتہ', ar: 'السبت' },
];

/**
 * Universal Hijri moon-sighting engine.
 * Computes the Hijri date for any Gregorian date with custom moon-sighting adjustment support.
 *
 * @param date Gregorian target date (defaults to current date)
 * @param options Moon sighting options or numeric adjustment in days
 */
export function getHijriDate(
  date: Date = new Date(),
  options?: number | HijriDateOptions
): HijriDateResult {
  const adjustment =
    typeof options === 'number' ? options : (options?.adjustment ?? 0);
  const method = typeof options === 'object' ? options.method ?? 'auto' : 'auto';

  // Apply moon-sighting offset in days
  const targetDate = new Date(date.getTime() + adjustment * 86400000);
  const dayOfWeek = DAYS_OF_WEEK[targetDate.getDay()];

  let day = 1;
  let monthIndex = 1;
  let year = 1400;

  let computed = false;

  if (method === 'auto') {
    try {
      const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
      const parts = formatter.formatToParts(targetDate);
      const d = parts.find((p) => p.type === 'day')?.value;
      const m = parts.find((p) => p.type === 'month')?.value;
      const y = parts.find((p) => p.type === 'year')?.value;

      if (d && m && y) {
        day = parseInt(d, 10);
        monthIndex = parseInt(m, 10);
        year = parseInt(y, 10);
        computed = true;
      }
    } catch {
      computed = false;
    }
  }

  if (!computed) {
    // Deterministic tabular algorithm (Kuwaiti / Islamic civil conversion)
    let d = targetDate.getDate();
    let m = targetDate.getMonth() + 1;
    let y = targetDate.getFullYear();

    if (m < 3) {
      y -= 1;
      m += 12;
    }

    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    const jd =
      Math.floor(365.25 * (y + 4716)) +
      Math.floor(30.6001 * (m + 1)) +
      d +
      b -
      1524.5;

    const l = Math.floor(jd - 1948440 + 10632);
    const n = Math.floor((l - 1) / 10631);
    const l1 = l - 10631 * n + 354;
    const j =
      Math.floor((10985 - l1) / 5316) * Math.floor((50 * l1) / 17719) +
      Math.floor(l1 / 5670) * Math.floor((43 * l1) / 15238);
    const l2 =
      l1 -
      Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
      Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
      29;

    monthIndex = Math.floor((24 * l2) / 709);
    day = l2 - Math.floor((709 * monthIndex) / 24);
    year = 30 * n + j - 30;
  }

  // Ensure month index stays in 1..12 range
  if (monthIndex < 1) monthIndex = 1;
  if (monthIndex > 12) monthIndex = 12;

  const monthObj = HIJRI_MONTHS[monthIndex - 1];

  // Check matching notable events
  const events = NOTABLE_ISLAMIC_EVENTS.filter(
    (e) => e.hijriMonth === monthIndex && e.hijriDay === day
  );

  // The 11th of every Islamic month is observed as Gyarween Sharif
  const isGyarweenSharif = day === 11;

  return {
    day,
    month: monthObj,
    year,
    dayOfWeek,
    formatted: {
      en: `${day} ${monthObj.en} ${year} AH`,
      ur: `${day} ${monthObj.ur} ${year}ھ`,
      ar: `${day} ${monthObj.ar} ${year} هـ`,
    },
    adjustment,
    events: [...events],
    isGyarweenSharif,
  };
}
