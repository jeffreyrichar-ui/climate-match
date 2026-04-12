#!/usr/bin/env node
/**
 * build-cities.mjs
 *
 * Builds src/data/cities.json by:
 *   1. Geocoding each city name via Open-Meteo's geocoding API
 *   2. Fetching 2 years of daily climate data from Open-Meteo's archive API
 *      (ERA5 reanalysis) — including hourly relative humidity
 *   3. Aggregating to annual averages in imperial units
 *
 * Run with:  node scripts/build-cities.mjs
 *
 * Free Open-Meteo APIs, no API key required.
 */

import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, '..', 'src', 'data', 'cities.json');

// 1-year climate window to keep Open-Meteo archive payload manageable.
// 2023 is the most recent full calendar year that is lag-safe.
const START_DATE = '2023-01-01';
const END_DATE = '2023-12-31';
const YEARS = 1;
const SLEEP_MS = 300; // geocoding is cheap
const MAX_RETRIES = 8;
const BATCH_SIZE = 100; // cities per batched archive/climate request

const CITY_NAMES = [
  // ===== USA (50) — climate diversity coast-to-coast =====
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Diego', 'Dallas', 'Austin', 'San Francisco', 'Seattle', 'Denver',
  'Washington DC', 'Boston', 'Portland Oregon', 'Las Vegas', 'Detroit',
  'Atlanta', 'Miami', 'Minneapolis', 'New Orleans', 'Honolulu', 'Anchorage',
  'Pittsburgh', 'Buffalo', 'Orlando', 'Tampa', 'Cleveland', 'Salt Lake City',
  'Albuquerque', 'Tucson', 'Sacramento', 'Kansas City', 'Saint Louis',
  'Nashville', 'Memphis', 'Charleston South Carolina', 'Savannah',
  'Burlington Vermont', 'Boise', 'Reno', 'Fargo', 'Billings', 'Spokane',
  'Cheyenne', 'Bismarck', 'Juneau', 'Fairbanks', 'Key West', 'Bangor Maine',

  // ===== Canada (10) =====
  'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Quebec City',
  'Halifax', 'Winnipeg', 'Whitehorse', 'St Johns Newfoundland',

  // ===== Mexico & Central America (12) =====
  'Mexico City', 'Guadalajara', 'Monterrey', 'Tijuana', 'Cancun', 'Merida Mexico',
  'Oaxaca', 'Guatemala City', 'San Salvador', 'San Jose Costa Rica',
  'Panama City', 'Hermosillo',

  // ===== Caribbean (6) =====
  'Havana', 'Santo Domingo', 'San Juan Puerto Rico', 'Kingston Jamaica',
  'Nassau Bahamas', 'Bridgetown',

  // ===== South America (20) =====
  'Sao Paulo', 'Rio de Janeiro', 'Buenos Aires', 'Lima', 'Bogota', 'Santiago Chile',
  'Caracas', 'Brasilia', 'Manaus', 'Quito', 'La Paz Bolivia', 'Asuncion',
  'Montevideo', 'Medellin', 'Cusco', 'Cartagena Colombia', 'Cordoba Argentina',
  'Mendoza', 'Ushuaia', 'Valparaiso',

  // ===== UK & Ireland (6) =====
  'London', 'Manchester', 'Edinburgh', 'Glasgow', 'Dublin', 'Belfast',

  // ===== Western & Southern Europe (28) =====
  'Paris', 'Marseille', 'Lyon', 'Nice', 'Bordeaux', 'Brussels', 'Amsterdam',
  'Madrid', 'Barcelona', 'Seville', 'Malaga', 'Lisbon', 'Porto',
  'Rome', 'Milan', 'Naples', 'Florence', 'Venice', 'Palermo',
  'Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Vienna', 'Salzburg',
  'Zurich', 'Geneva', 'Reykjavik',

  // ===== Northern & Eastern Europe (22) =====
  'Oslo', 'Bergen', 'Stockholm', 'Helsinki', 'Copenhagen', 'Tallinn', 'Riga',
  'Vilnius', 'Warsaw', 'Krakow', 'Prague', 'Bratislava', 'Budapest',
  'Bucharest', 'Sofia', 'Belgrade', 'Zagreb', 'Ljubljana', 'Athens',
  'Istanbul', 'Ankara', 'Antalya',

  // ===== Russia & Caucasus (10) =====
  'Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Vladivostok',
  'Yakutsk', 'Murmansk', 'Sochi', 'Tbilisi', 'Baku',

  // ===== Middle East (14) =====
  'Tehran', 'Isfahan', 'Baghdad', 'Beirut', 'Amman', 'Jerusalem', 'Tel Aviv',
  'Riyadh', 'Jeddah', 'Dubai', 'Abu Dhabi', 'Doha', 'Kuwait City', 'Muscat',

  // ===== North Africa (8) =====
  'Cairo', 'Alexandria Egypt', 'Tunis', 'Algiers', 'Casablanca', 'Marrakech',
  'Khartoum', 'Tripoli Libya',

  // ===== Sub-Saharan Africa (16) =====
  'Lagos', 'Accra', 'Abidjan', 'Dakar', 'Yaounde', 'Kinshasa', 'Luanda',
  'Windhoek', 'Johannesburg', 'Cape Town', 'Durban', 'Maputo', 'Antananarivo',
  'Nairobi', 'Addis Ababa', 'Dar es Salaam',

  // ===== South Asia (16) =====
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Jaipur',
  'Srinagar', 'Kochi', 'Karachi', 'Lahore', 'Islamabad', 'Dhaka', 'Colombo',
  'Kathmandu', 'Thimphu',

  // ===== East Asia (24) =====
  'Tokyo', 'Osaka', 'Sapporo', 'Fukuoka', 'Naha', 'Seoul', 'Busan', 'Pyongyang',
  'Beijing', 'Shanghai', 'Guangzhou', 'Chongqing', 'Chengdu', 'Xian', 'Harbin',
  'Kunming', 'Lhasa', 'Urumqi', 'Hong Kong', 'Taipei', 'Kaohsiung',
  'Ulaanbaatar', 'Macau', 'Hangzhou',

  // ===== Southeast Asia (16) =====
  'Bangkok', 'Chiang Mai', 'Phuket', 'Hanoi', 'Ho Chi Minh City', 'Vientiane',
  'Phnom Penh', 'Yangon', 'Kuala Lumpur', 'Singapore', 'Jakarta', 'Bali Denpasar',
  'Yogyakarta', 'Manila', 'Cebu City', 'Bandar Seri Begawan',

  // ===== Oceania & Pacific (12) =====
  'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Hobart', 'Darwin',
  'Auckland', 'Wellington', 'Christchurch', 'Queenstown', 'Suva', 'Papeete',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, label) {
  let lastErr;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const r = await fetch(url);
      if (r.status === 429) {
        const wait = 2000 * attempt * attempt; // 2s, 8s, 18s, 32s, 50s
        console.log(`    ${label} 429 — backing off ${wait}ms (attempt ${attempt})`);
        await sleep(wait);
        continue;
      }
      if (!r.ok) throw new Error(`${label} HTTP ${r.status}`);
      return r.json();
    } catch (e) {
      lastErr = e;
      await sleep(1000 * attempt);
    }
  }
  throw lastErr ?? new Error(`${label} failed after ${MAX_RETRIES} retries`);
}

async function geocode(name) {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}` +
    `&count=1&language=en&format=json`;
  const j = await fetchWithRetry(url, 'geocode');
  const hit = j.results?.[0];
  if (!hit) return null;
  return {
    name: hit.name,
    country: hit.country ?? '',
    lat: hit.latitude,
    lon: hit.longitude,
  };
}

/**
 * Batched archive request — ERA5 daily data for up to BATCH_SIZE cities
 * in a single HTTP call. Open-Meteo returns an array of per-location objects.
 */
async function fetchArchiveBatch(coords) {
  const lats = coords.map((c) => c.lat).join(',');
  const lons = coords.map((c) => c.lon).join(',');
  const url =
    `https://archive-api.open-meteo.com/v1/archive` +
    `?latitude=${lats}&longitude=${lons}` +
    `&start_date=${START_DATE}&end_date=${END_DATE}` +
    `&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,rain_sum,snowfall_sum,sunshine_duration,precipitation_sum,wind_speed_10m_max` +
    `&temperature_unit=fahrenheit&precipitation_unit=inch&wind_speed_unit=mph&timezone=UTC`;
  const result = await fetchWithRetry(url, 'archive');
  // Single-location responses come back as an object; normalize to array.
  return Array.isArray(result) ? result : [result];
}

/**
 * Batched dew point request — CMIP6 historical daily data for up to
 * BATCH_SIZE cities in a single HTTP call. Returns an array of per-location
 * objects matching the input order.
 */
async function fetchDewPointBatch(coords) {
  const lats = coords.map((c) => c.lat).join(',');
  const lons = coords.map((c) => c.lon).join(',');
  const url =
    `https://climate-api.open-meteo.com/v1/climate` +
    `?latitude=${lats}&longitude=${lons}` +
    `&start_date=2010-01-01&end_date=2014-12-31` +
    `&models=MRI_AGCM3_2_S` +
    `&daily=dew_point_2m_mean` +
    `&temperature_unit=fahrenheit`;
  const result = await fetchWithRetry(url, 'climate');
  return Array.isArray(result) ? result : [result];
}

const sum = (arr) => arr.reduce((a, b) => a + (b ?? 0), 0);
const meanNonNull = (arr) => {
  const filtered = arr.filter((v) => v != null && Number.isFinite(v));
  return filtered.length ? sum(filtered) / filtered.length : null;
};
const round = (n, places = 0) => {
  const m = 10 ** places;
  return Math.round(n * m) / m;
};

function aggregate(archiveData, climateData) {
  const d = archiveData.daily;
  if (!d) throw new Error('no daily data');

  const time = d.time;
  const tmax = d.temperature_2m_max;
  const tmin = d.temperature_2m_min;
  const tmean = d.temperature_2m_mean;
  const rain = d.rain_sum;
  const snow = d.snowfall_sum;
  const sun = d.sunshine_duration;
  const precipAll = d.precipitation_sum;
  const wind = d.wind_speed_10m_max;

  const avgTempF = round(meanNonNull(tmean));
  // average daily swing (max - min) across all valid days
  const swings = [];
  for (let i = 0; i < tmax.length; i++) {
    if (tmax[i] != null && tmin[i] != null) swings.push(tmax[i] - tmin[i]);
  }
  const dailyVarianceF = round(meanNonNull(swings));

  // sums are over the YEARS-year window — divide for annual figure
  const rainInches = round(sum(rain) / YEARS);
  const snowInches = round(sum(snow) / YEARS);
  const sunHours = round(sum(sun) / 3600 / YEARS);

  // Dew point comes from a separate climate-api request (CMIP6 historical)
  const dewPointDaily = climateData?.daily?.dew_point_2m_mean ?? [];
  const dewPointF = round(meanNonNull(dewPointDaily));

  // Group daily data by calendar month (1-12) to find hottest/coldest months
  const monthlyHighs = Array.from({ length: 12 }, () => []);
  const monthlyLows = Array.from({ length: 12 }, () => []);
  const monthlyMeans = Array.from({ length: 12 }, () => []);
  for (let i = 0; i < time.length; i++) {
    const m = parseInt(time[i].slice(5, 7), 10) - 1;
    if (tmax[i] != null) monthlyHighs[m].push(tmax[i]);
    if (tmin[i] != null) monthlyLows[m].push(tmin[i]);
    if (tmean[i] != null) monthlyMeans[m].push(tmean[i]);
  }
  const monthHighAvg = monthlyHighs.map(meanNonNull);
  const monthLowAvg = monthlyLows.map(meanNonNull);
  const monthMeanAvg = monthlyMeans.map(meanNonNull);

  // Hottest / coldest month chosen by monthly mean temperature
  let hotIdx = 0, coldIdx = 0;
  for (let i = 1; i < 12; i++) {
    if ((monthMeanAvg[i] ?? -Infinity) > (monthMeanAvg[hotIdx] ?? -Infinity)) hotIdx = i;
    if ((monthMeanAvg[i] ?? Infinity) < (monthMeanAvg[coldIdx] ?? Infinity)) coldIdx = i;
  }
  const summerHighF = round(monthHighAvg[hotIdx] ?? avgTempF);
  const winterLowF = round(monthLowAvg[coldIdx] ?? avgTempF);

  // Rainy days = days where measurable precipitation (>= 0.04 in ≈ 1mm)
  let rainyDayCount = 0;
  for (const v of precipAll) if ((v ?? 0) >= 0.04) rainyDayCount++;
  const rainyDays = round(rainyDayCount / YEARS);

  // Wind: average of daily max wind speed (so "how windy it typically gets")
  const windMph = round(meanNonNull(wind));

  return {
    avgTempF,
    rainInches,
    snowInches,
    sunHours,
    dailyVarianceF,
    summerHighF,
    winterLowF,
    rainyDays,
    windMph,
    dewPointF,
  };
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** A city record is "fresh" only if it has all the current fields */
const REQUIRED_CLIMATE_FIELDS = [
  'avgTempF', 'rainInches', 'snowInches', 'sunHours', 'dailyVarianceF',
  'summerHighF', 'winterLowF', 'rainyDays', 'windMph', 'dewPointF',
];
function isFresh(city) {
  return REQUIRED_CLIMATE_FIELDS.every((k) => typeof city?.climate?.[k] === 'number');
}
async function loadExisting() {
  try {
    const txt = await readFile(OUT_PATH, 'utf8');
    const arr = JSON.parse(txt);
    if (Array.isArray(arr)) return arr.filter(isFresh);
  } catch {}
  return [];
}

/** Atomically write the current city list — called after every successful fetch
 *  so a crash or rate-limit kill loses at most the in-flight city. */
async function saveOut(out) {
  const seen = new Set();
  const deduped = [];
  for (const c of out) {
    const key = `${c.name}|${c.country}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(c);
  }
  deduped.sort((a, b) =>
    a.name.localeCompare(b.name) || a.country.localeCompare(b.country),
  );
  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(deduped, null, 2) + '\n');
}

async function main() {
  const existing = await loadExisting();
  const out = [...existing];
  const seenNames = new Set(existing.map((c) => normalize(c.name)));
  const failed = [];
  console.log(`Resuming with ${existing.length} existing cities`);

  // ---- Phase 1: geocode every city that isn't already on disk ----
  const toFetch = [];
  let i = 0;
  for (const name of CITY_NAMES) {
    i++;
    if (seenNames.has(normalize(name))) continue;
    const tag = `[geo ${String(i).padStart(3)}/${CITY_NAMES.length}] ${name}`;
    try {
      const geo = await geocode(name);
      if (!geo) {
        console.log(`${tag} — NOT FOUND`);
        failed.push({ name, reason: 'geocode' });
      } else {
        toFetch.push({ ...geo, inputName: name });
        console.log(`${tag} — ${geo.country} (${round(geo.lat, 2)}, ${round(geo.lon, 2)})`);
      }
    } catch (e) {
      console.log(`${tag} — ERROR ${e.message}`);
      failed.push({ name, reason: e.message });
    }
    await sleep(SLEEP_MS);
  }

  // ---- Phase 2: batched climate fetches, BATCH_SIZE cities per request ----
  const totalBatches = Math.ceil(toFetch.length / BATCH_SIZE);
  console.log(
    `\nGeocoded ${toFetch.length} cities. Fetching climate in ${totalBatches} batched request(s) of up to ${BATCH_SIZE}.`,
  );

  for (let start = 0; start < toFetch.length; start += BATCH_SIZE) {
    const chunk = toFetch.slice(start, start + BATCH_SIZE);
    const batchNum = start / BATCH_SIZE + 1;
    const tag = `[batch ${batchNum}/${totalBatches}] ${chunk.length} cities`;
    try {
      const archiveResults = await fetchArchiveBatch(chunk);
      await sleep(1000);
      const climateResults = await fetchDewPointBatch(chunk);

      if (archiveResults.length !== chunk.length || climateResults.length !== chunk.length) {
        throw new Error(
          `response length mismatch: archive=${archiveResults.length} climate=${climateResults.length} chunk=${chunk.length}`,
        );
      }

      let added = 0;
      for (let j = 0; j < chunk.length; j++) {
        const geo = chunk[j];
        try {
          const climate = aggregate(archiveResults[j], climateResults[j]);
          if (
            climate.avgTempF == null ||
            climate.dewPointF == null ||
            Number.isNaN(climate.avgTempF)
          ) {
            console.log(`  ${geo.inputName} — bad data`);
            failed.push({ name: geo.inputName, reason: 'bad data' });
            continue;
          }
          out.push({
            name: geo.name,
            country: geo.country,
            lat: round(geo.lat, 2),
            lon: round(geo.lon, 2),
            climate,
          });
          seenNames.add(normalize(geo.name));
          added++;
        } catch (e) {
          console.log(`  ${geo.inputName} — aggregate error ${e.message}`);
          failed.push({ name: geo.inputName, reason: e.message });
        }
      }
      await saveOut(out);
      console.log(`${tag} — added ${added}, ${out.length} total on disk`);
    } catch (e) {
      console.log(`${tag} — ERROR ${e.message}`);
      for (const geo of chunk) {
        failed.push({ name: geo.inputName, reason: e.message });
      }
    }
    await sleep(2000);
  }

  await saveOut(out);
  console.log(
    `\nDone. Wrote ${out.length} cities to ${OUT_PATH}` +
      (failed.length ? `\nFailed: ${failed.length}` : ''),
  );
  if (failed.length) {
    console.log(failed.map((f) => `  - ${f.name} (${f.reason})`).join('\n'));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
