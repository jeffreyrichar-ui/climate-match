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
const SLEEP_MS = 1500; // be nice to the free API
const MAX_RETRIES = 8;

const CITY_NAMES = [
  // ===== USA (100) =====
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
  'Fort Worth', 'Columbus Ohio', 'Charlotte', 'Indianapolis', 'San Francisco',
  'Seattle', 'Denver', 'Washington DC', 'Nashville', 'Oklahoma City', 'El Paso',
  'Boston', 'Portland Oregon', 'Las Vegas', 'Detroit', 'Memphis', 'Louisville',
  'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento',
  'Mesa Arizona', 'Kansas City', 'Atlanta', 'Long Beach', 'Colorado Springs',
  'Raleigh', 'Miami', 'Virginia Beach', 'Omaha', 'Oakland', 'Minneapolis',
  'Tulsa', 'Arlington Texas', 'New Orleans', 'Wichita', 'Bakersfield',
  'Cleveland', 'Tampa', 'Aurora Colorado', 'Honolulu', 'Anaheim', 'Santa Ana',
  'Corpus Christi', 'Riverside California', 'Saint Louis', 'Lexington Kentucky',
  'Stockton', 'Pittsburgh', 'Saint Paul', 'Anchorage', 'Cincinnati', 'Henderson Nevada',
  'Greensboro', 'Plano', 'Newark', 'Toledo', 'Lincoln Nebraska', 'Orlando',
  'Jersey City', 'Chandler Arizona', 'Fort Wayne', 'Buffalo', 'Durham',
  'Saint Petersburg Florida', 'Irvine', 'Laredo', 'Lubbock', 'Madison Wisconsin',
  'Norfolk Virginia', 'Reno', 'Winston-Salem', 'Glendale Arizona', 'Hialeah',
  'Garland Texas', 'Scottsdale', 'Irving', 'Chesapeake', 'Fremont California',
  'Baton Rouge', 'Richmond Virginia', 'Boise', 'Spokane', 'Des Moines',
  'Fargo', 'Billings', 'Burlington Vermont', 'Charleston South Carolina', 'Savannah',

  // ===== Canada (15) =====
  'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa',
  'Winnipeg', 'Quebec City', 'Hamilton Ontario', 'Victoria BC', 'Halifax',
  'Saskatoon', 'Regina Saskatchewan', 'St Johns Newfoundland', 'Whitehorse',

  // ===== Mexico (15) =====
  'Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'Leon Mexico',
  'Ciudad Juarez', 'Cancun', 'Merida Mexico', 'Oaxaca', 'Acapulco', 'Veracruz',
  'San Luis Potosi', 'Chihuahua', 'Hermosillo',

  // ===== Central America & Caribbean (15) =====
  'Guatemala City', 'San Salvador', 'Tegucigalpa', 'Managua', 'San Jose Costa Rica',
  'Panama City', 'Belize City', 'Havana', 'Santo Domingo', 'San Juan Puerto Rico',
  'Kingston Jamaica', 'Port-au-Prince', 'Nassau Bahamas', 'Bridgetown', 'Castries',

  // ===== South America (35) =====
  'Sao Paulo', 'Rio de Janeiro', 'Buenos Aires', 'Lima', 'Bogota', 'Santiago Chile',
  'Caracas', 'Brasilia', 'Belo Horizonte', 'Salvador Brazil', 'Fortaleza',
  'Recife', 'Curitiba', 'Porto Alegre', 'Manaus', 'Quito', 'Guayaquil',
  'La Paz Bolivia', 'Sucre', 'Asuncion', 'Montevideo', 'Cordoba Argentina',
  'Rosario', 'Mendoza', 'Medellin', 'Cali', 'Cartagena Colombia', 'Cusco',
  'Arequipa', 'Cayenne', 'Paramaribo', 'Georgetown Guyana', 'Maracaibo',
  'Valparaiso', 'Ushuaia',

  // ===== UK & Ireland (15) =====
  'London', 'Manchester', 'Birmingham UK', 'Glasgow', 'Liverpool', 'Leeds',
  'Sheffield', 'Edinburgh', 'Bristol UK', 'Cardiff', 'Belfast', 'Newcastle UK',
  'Dublin', 'Cork', 'Galway',

  // ===== Western & Southern Europe (50) =====
  'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Bordeaux', 'Strasbourg',
  'Brussels', 'Antwerp', 'Amsterdam', 'Rotterdam', 'The Hague', 'Madrid',
  'Barcelona', 'Valencia Spain', 'Seville', 'Bilbao', 'Malaga', 'Lisbon',
  'Porto', 'Rome', 'Milan', 'Naples', 'Turin', 'Florence', 'Venice', 'Bologna',
  'Palermo', 'Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', 'Stuttgart',
  'Dresden', 'Leipzig', 'Dusseldorf', 'Vienna', 'Salzburg', 'Zurich', 'Geneva',
  'Bern', 'Basel', 'Luxembourg', 'Monaco', 'Andorra la Vella', 'Reykjavik',
  'Oslo', 'Bergen', 'Stockholm',

  // ===== Northern & Eastern Europe (40) =====
  'Helsinki', 'Tampere', 'Copenhagen', 'Aarhus', 'Tallinn', 'Riga', 'Vilnius',
  'Warsaw', 'Krakow', 'Gdansk', 'Wroclaw', 'Prague', 'Brno', 'Bratislava',
  'Budapest', 'Debrecen', 'Bucharest', 'Cluj-Napoca', 'Sofia', 'Plovdiv',
  'Belgrade', 'Zagreb', 'Sarajevo', 'Ljubljana', 'Skopje', 'Pristina', 'Tirana',
  'Podgorica', 'Athens', 'Thessaloniki', 'Heraklion', 'Istanbul', 'Ankara',
  'Izmir', 'Antalya', 'Bursa', 'Adana', 'Konya', 'Trabzon', 'Gaziantep',

  // ===== Russia & Caucasus (20) =====
  'Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan',
  'Nizhny Novgorod', 'Chelyabinsk', 'Samara', 'Omsk', 'Rostov-on-Don', 'Ufa',
  'Krasnoyarsk', 'Volgograd', 'Vladivostok', 'Yakutsk', 'Murmansk', 'Sochi',
  'Tbilisi', 'Yerevan', 'Baku',

  // ===== Middle East (25) =====
  'Tehran', 'Mashhad', 'Isfahan', 'Shiraz', 'Tabriz', 'Baghdad', 'Basra',
  'Mosul', 'Damascus', 'Aleppo', 'Beirut', 'Amman', 'Jerusalem', 'Tel Aviv',
  'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dubai', 'Abu Dhabi', 'Doha',
  'Manama', 'Kuwait City', 'Muscat', 'Sanaa',

  // ===== North Africa (15) =====
  'Cairo', 'Alexandria Egypt', 'Luxor', 'Tripoli Libya', 'Tunis', 'Algiers',
  'Oran', 'Casablanca', 'Marrakech', 'Rabat', 'Fes', 'Tangier', 'Khartoum',
  'Nouakchott', 'Bamako',

  // ===== Sub-Saharan Africa (35) =====
  'Lagos', 'Abuja', 'Kano', 'Accra', 'Kumasi', 'Abidjan', 'Yamoussoukro',
  'Dakar', 'Conakry', 'Freetown', 'Monrovia', 'Ouagadougou', 'Niamey',
  'Ndjamena', 'Yaounde', 'Douala', 'Libreville', 'Brazzaville', 'Kinshasa',
  'Luanda', 'Windhoek', 'Gaborone', 'Pretoria', 'Johannesburg', 'Cape Town',
  'Durban', 'Port Elizabeth', 'Bloemfontein', 'Maseru', 'Mbabane', 'Maputo',
  'Antananarivo', 'Nairobi', 'Mombasa', 'Kampala',

  // ===== East Africa & Horn (5) =====
  'Addis Ababa', 'Asmara', 'Djibouti', 'Mogadishu', 'Dar es Salaam',

  // ===== South Asia (40) =====
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata',
  'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal',
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Coimbatore', 'Agra', 'Madurai',
  'Varanasi', 'Srinagar', 'Amritsar', 'Kochi', 'Panaji', 'Karachi', 'Lahore',
  'Islamabad', 'Faisalabad', 'Peshawar', 'Quetta', 'Dhaka', 'Chittagong',
  'Colombo', 'Kandy', 'Kathmandu', 'Pokhara', 'Thimphu',

  // ===== East Asia (50) =====
  'Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto',
  'Kawasaki', 'Saitama', 'Hiroshima', 'Sendai', 'Naha', 'Seoul', 'Busan',
  'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Ulsan', 'Jeju', 'Pyongyang',
  'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Tianjin', 'Chongqing',
  'Wuhan', 'Chengdu', 'Xian', 'Hangzhou', 'Nanjing', 'Suzhou', 'Qingdao',
  'Harbin', 'Dalian', 'Kunming', 'Lhasa', 'Urumqi', 'Lanzhou', 'Hohhot',
  'Hong Kong', 'Macau', 'Taipei', 'Kaohsiung', 'Taichung', 'Tainan',
  'Ulaanbaatar', 'Quanzhou',

  // ===== Southeast Asia (30) =====
  'Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Hanoi', 'Ho Chi Minh City',
  'Da Nang', 'Hue', 'Vientiane', 'Luang Prabang', 'Phnom Penh', 'Siem Reap',
  'Yangon', 'Mandalay', 'Naypyidaw', 'Kuala Lumpur', 'George Town Penang',
  'Kota Kinabalu', 'Kuching', 'Singapore', 'Jakarta', 'Surabaya', 'Bandung',
  'Medan', 'Denpasar', 'Yogyakarta', 'Manila', 'Cebu City', 'Davao',
  'Bandar Seri Begawan',

  // ===== Oceania (15) =====
  'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Hobart', 'Darwin',
  'Canberra', 'Gold Coast', 'Auckland', 'Wellington', 'Christchurch',
  'Queenstown', 'Suva', 'Port Moresby',

  // ===== Pacific Islands (5) =====
  'Apia', 'Nukualofa', 'Port Vila', 'Noumea', 'Papeete',
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

async function fetchClimate(lat, lon) {
  const url =
    `https://archive-api.open-meteo.com/v1/archive` +
    `?latitude=${lat}&longitude=${lon}` +
    `&start_date=${START_DATE}&end_date=${END_DATE}` +
    `&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,rain_sum,snowfall_sum,sunshine_duration` +
    `&hourly=relative_humidity_2m` +
    `&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=UTC`;
  return fetchWithRetry(url, 'archive');
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

function aggregate(data) {
  const d = data.daily;
  if (!d) throw new Error('no daily data');

  const tmax = d.temperature_2m_max;
  const tmin = d.temperature_2m_min;
  const tmean = d.temperature_2m_mean;
  const rain = d.rain_sum;
  const snow = d.snowfall_sum;
  const sun = d.sunshine_duration;

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

  const humidityPct = round(meanNonNull(data.hourly?.relative_humidity_2m ?? []));

  return {
    avgTempF,
    rainInches,
    snowInches,
    sunHours,
    humidityPct,
    dailyVarianceF,
  };
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function loadExisting() {
  try {
    const txt = await readFile(OUT_PATH, 'utf8');
    const arr = JSON.parse(txt);
    if (Array.isArray(arr)) return arr;
  } catch {}
  return [];
}

async function main() {
  const existing = await loadExisting();
  const out = [...existing];
  const seenNames = new Set(existing.map((c) => normalize(c.name)));
  const failed = [];
  let i = 0;
  console.log(`Resuming with ${existing.length} existing cities`);

  for (const name of CITY_NAMES) {
    i++;
    // skip if we already have this city (rough match by normalized name)
    if (seenNames.has(normalize(name))) continue;
    const tag = `[${String(i).padStart(3)}/${CITY_NAMES.length}] ${name}`;
    try {
      const geo = await geocode(name);
      if (!geo) {
        console.log(`${tag} — NOT FOUND`);
        failed.push({ name, reason: 'geocode' });
        await sleep(SLEEP_MS);
        continue;
      }
      await sleep(SLEEP_MS);

      const data = await fetchClimate(geo.lat, geo.lon);
      const climate = aggregate(data);

      // sanity-check that we got real numbers
      if (
        climate.avgTempF == null ||
        climate.humidityPct == null ||
        Number.isNaN(climate.avgTempF)
      ) {
        console.log(`${tag} — bad data`);
        failed.push({ name, reason: 'bad data' });
        await sleep(SLEEP_MS);
        continue;
      }

      out.push({
        name: geo.name,
        country: geo.country,
        lat: round(geo.lat, 2),
        lon: round(geo.lon, 2),
        climate,
      });
      console.log(
        `${tag} — ${geo.country} · ${climate.avgTempF}°F · ${climate.rainInches}in rain · ${climate.snowInches}in snow`,
      );
    } catch (e) {
      console.log(`${tag} — ERROR ${e.message}`);
      failed.push({ name, reason: e.message });
    }
    await sleep(SLEEP_MS);
  }

  // de-duplicate by (name, country)
  const seen = new Set();
  const deduped = [];
  for (const c of out) {
    const key = `${c.name}|${c.country}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(c);
  }
  // alphabetize for stable diffs
  deduped.sort((a, b) =>
    a.name.localeCompare(b.name) || a.country.localeCompare(b.country),
  );

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(deduped, null, 2) + '\n');

  console.log(
    `\nDone. Wrote ${deduped.length} cities to ${OUT_PATH}` +
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
