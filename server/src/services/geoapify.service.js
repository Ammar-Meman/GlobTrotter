import { CITIES_DATA } from "../data/cities.data.js";

// ── Category mapping: our app types → Geoapify "categories" ───────────────
const TYPE_TO_GEOAPIFY_CATEGORY = {
  sightseeing: "tourism.attraction,tourism.sights",
  food: "catering.restaurant,catering.cafe",
  adventure: "leisure.park,sport",
  shopping: "commercial.shopping_mall,commercial.marketplace",
  museum: "tourism.attraction.museum",
};

// ── Static mock data ──────────────────────────────────────────────────────
const MOCK_ACTIVITIES_BY_CITY = {
  paris: [
    {
      name: "Louvre Museum",
      type: "sightseeing",
      estimatedCost: 25,
      description: "World's largest art museum and historic monument in Paris.",
      imageUrl: "https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Eiffel Tower Summit Access",
      type: "sightseeing",
      estimatedCost: 35,
      description: "Panoramic views of Paris from the iconic landmark.",
      imageUrl: "https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Seine River Dinner Cruise",
      type: "food",
      estimatedCost: 85,
      description: "Gourmet French dinner while cruising along the illuminated Seine.",
      imageUrl: "https://images.pexels.com/photos/161853/prague-czech-republic-city-161853.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Montmartre Walking Tour",
      type: "sightseeing",
      estimatedCost: 15,
      description: "Explore the bohemian hill with Sacre-Coeur and artists square.",
      imageUrl: "https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ],
  tokyo: [
    {
      name: "Senso-ji Temple Exploration",
      type: "sightseeing",
      estimatedCost: 0,
      description: "Tokyo's oldest and most significant ancient Buddhist temple.",
      imageUrl: "https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Shibuya Crossing & Hachiko Statue",
      type: "sightseeing",
      estimatedCost: 0,
      description: "Experience the world-famous scramble crossing in bustling Shibuya.",
      imageUrl: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Tsukiji Outer Market Food Tour",
      type: "food",
      estimatedCost: 45,
      description: "Sample fresh sashimi, tamagoyaki, and Japanese street food delicacies.",
      imageUrl: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "teamLab Planets Digital Art",
      type: "adventure",
      estimatedCost: 38,
      description: "Immersive body-interactive digital art museum.",
      imageUrl: "https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ],
  rome: [
    {
      name: "Colosseum & Roman Forum Tour",
      type: "sightseeing",
      estimatedCost: 28,
      description: "Walk in the footsteps of gladiators in ancient Rome.",
      imageUrl: "https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Vatican Museums & Sistine Chapel",
      type: "sightseeing",
      estimatedCost: 32,
      description: "Marvel at Michelangelo's ceiling fresco and Renaissance masterpieces.",
      imageUrl: "https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Trastevere Food & Wine Walking Tour",
      type: "food",
      estimatedCost: 55,
      description: "Authentic Roman pasta, supplì, gelato, and regional Italian wines.",
      imageUrl: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ],
  barcelona: [
    {
      name: "Sagrada Familia Guided Visit",
      type: "sightseeing",
      estimatedCost: 30,
      description: "Gaudí's unfinished architectural marvel and UNESCO World Heritage site.",
      imageUrl: "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Park Güell Monumental Zone",
      type: "sightseeing",
      estimatedCost: 15,
      description: "Colorful mosaic park overlooking the city of Barcelona.",
      imageUrl: "https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Tapas & Flamenco Show",
      type: "food",
      estimatedCost: 60,
      description: "Live flamenco performance paired with traditional Catalan tapas.",
      imageUrl: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ],
  london: [
    {
      name: "Tower of London & Crown Jewels",
      type: "sightseeing",
      estimatedCost: 35,
      description: "Historic royal fortress and home to the glittering Crown Jewels.",
      imageUrl: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "British Museum Highlights",
      type: "sightseeing",
      estimatedCost: 0,
      description: "World-class collection spanning 2 million years of human history.",
      imageUrl: "https://images.pexels.com/photos/1128408/pexels-photo-1128408.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ],
  "new york": [
    {
      name: "Empire State Building Observatory",
      type: "sightseeing",
      estimatedCost: 44,
      description: "Iconic art deco skyscraper with 360-degree views of Manhattan.",
      imageUrl: "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Central Park Bike Rental Tour",
      type: "adventure",
      estimatedCost: 25,
      description: "Cycle through Bow Bridge, Strawberry Fields, and Bethesda Terrace.",
      imageUrl: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ],
};

const DEFAULT_ACTIVITIES = [
  {
    name: "Historic Old Town Walking Tour",
    type: "sightseeing",
    estimatedCost: 15,
    description: "Guided cultural walk through the historic center and notable landmarks.",
    imageUrl: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "Local Food Market Tasting Tour",
    type: "food",
    estimatedCost: 40,
    description: "Sample delicious regional cuisine, fresh street food, and local specialties.",
    imageUrl: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "City Art & History Museum",
    type: "sightseeing",
    estimatedCost: 20,
    description: "Discover regional history, cultural treasures, and masterworks.",
    imageUrl: "https://images.pexels.com/photos/1128408/pexels-photo-1128408.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "Scenic Riverfront or Harbor Cruise",
    type: "adventure",
    estimatedCost: 30,
    description: "Relaxing sightseeing boat tour offering scenic skyline viewpoints.",
    imageUrl: "https://images.pexels.com/photos/161853/prague-czech-republic-city-161853.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Merge a geocoded result with our cost-index/popularity lookup.
 * @param {string} cityName
 * @param {string} country
 * @param {number} lat
 * @param {number} lon
 */
function mergeWithStaticData(cityName, country, lat, lon) {
  const clean = cityName.trim().toLowerCase();
  const staticEntry = CITIES_DATA.find(
    (c) =>
      c.cityName.toLowerCase() === clean ||
      c.cityName.toLowerCase().includes(clean) ||
      clean.includes(c.cityName.toLowerCase())
  );

  // Derive plausible defaults from country when no static match
  const countryLower = (country || "").toLowerCase();
  let defaultCost = 50.0;
  let defaultPop = 70;

  if (!staticEntry) {
    // Cost index by region/country
    if (/switzerland|norway|denmark|iceland|luxembourg/.test(countryLower)) defaultCost = 95;
    else if (/united kingdom|uk|ireland|austria|sweden|finland/.test(countryLower)) defaultCost = 85;
    else if (/france|germany|netherlands|belgium|italy|spain|australia|new zealand|canada|singapore/.test(countryLower)) defaultCost = 78;
    else if (/united states|usa|japan|south korea|hong kong/.test(countryLower)) defaultCost = 82;
    else if (/portugal|greece|czech|poland|hungary|croatia/.test(countryLower)) defaultCost = 62;
    else if (/china|brazil|mexico|malaysia|thailand|turkey/.test(countryLower)) defaultCost = 48;
    else if (/india|indonesia|vietnam|philippines|egypt|morocco/.test(countryLower)) defaultCost = 38;
    else if (/nepal|bangladesh|cambodia|myanmar|ethiopia|kenya/.test(countryLower)) defaultCost = 28;

    // Add small name-hash variation (±8) so cities look distinct
    const hash = cityName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    defaultCost = Math.round((defaultCost + (hash % 17) - 8) * 10) / 10;
    defaultPop = 60 + (hash % 35);
  }

  return {
    cityName,
    country: country || staticEntry?.country || "Unknown",
    latitude: lat,
    longitude: lon,
    costIndex: staticEntry?.costIndex ?? defaultCost,
    popularity: staticEntry?.popularity ?? defaultPop,
  };
}

/**
 * Calls Geoapify Geocoding API if GEOAPIFY_API_KEY is set, otherwise falls back to
 * static CITIES_DATA lookup.
 * @param {string} query
 * @returns {Promise<Array<{cityName: string, country: string, latitude: number, longitude: number, costIndex: number, popularity: number}>>}
 */
export const searchCities = async (query) => {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  // ── Live path ─────────────────────────────────────────────────────────────
  if (apiKey && apiKey.trim() !== "" && query && query.trim() !== "") {
    try {
      const encoded = encodeURIComponent(query.trim());
      const url =
        `https://api.geoapify.com/v1/geocode/search` +
        `?text=${encoded}&type=city&limit=8&apiKey=${apiKey.trim()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Geoapify Geocoding HTTP ${response.status}`);
      const json = await response.json();

      const results = (json.features || []).map((feature) => {
        const p = feature.properties || {};
        const lat = p.lat ?? feature.geometry?.coordinates?.[1] ?? 0;
        const lon = p.lon ?? feature.geometry?.coordinates?.[0] ?? 0;
        const cityName = p.city || p.name || p.formatted?.split(",")?.[0]?.trim() || query.trim();
        const country = p.country || "";
        return mergeWithStaticData(cityName, country, lat, lon);
      });

      if (results.length > 0) return results;
      // fall through to static if Geoapify returned nothing
    } catch (err) {
      console.warn("[geoapify.service] Geocoding API failed, falling back to static:", err.message);
    }
  }

  // ── Static fallback ───────────────────────────────────────────────────────
  if (!query || query.trim() === "") {
    return CITIES_DATA.slice(0, 10);
  }

  const cleanQuery = query.trim().toLowerCase();
  const matched = CITIES_DATA.filter(
    (c) =>
      c.cityName.toLowerCase().includes(cleanQuery) ||
      (c.country && c.country.toLowerCase().includes(cleanQuery))
  );

  if (matched.length > 0) return matched;

  // Unknown city — derive plausible values
  const capitalized = query.charAt(0).toUpperCase() + query.slice(1);
  const hash = capitalized.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return [
    {
      cityName: capitalized,
      country: "Global Destination",
      latitude: 0.0,
      longitude: 0.0,
      costIndex: Math.round((50 + (hash % 17) - 8) * 10) / 10,
      popularity: 60 + (hash % 35),
    },
  ];
};

/**
 * Geocode a city name to lat/lon via Geoapify to obtain coordinates for a
 * Places search (only needed for the live path; mocks have it built-in).
 */
async function geocodeCity(cityName) {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  const url =
    `https://api.geoapify.com/v1/geocode/search` +
    `?text=${encodeURIComponent(cityName)}&type=city&limit=1&apiKey=${apiKey?.trim()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Geoapify geocode HTTP ${response.status}`);
  const json = await response.json();
  const feature = json.features?.[0];
  if (!feature) return null;
  const { lon, lat } = feature.properties;
  return { lat, lon };
}

/**
 * Searches suggested activities using Geoapify Places API when GEOAPIFY_API_KEY
 * is set, otherwise falls back to static mock data.
 * @param {{ city?: string, type?: string, maxCost?: number }} params
 * @returns {Promise<Array<{name: string, type: string, estimatedCost: number, description: string, imageUrl: string}>>}
 */
export const searchActivities = async ({ city, type, maxCost }) => {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  // ── Live path ─────────────────────────────────────────────────────────────
  if (apiKey && apiKey.trim() !== "" && city) {
    try {
      const coords = await geocodeCity(city);
      if (coords) {
        const category =
          (type && TYPE_TO_GEOAPIFY_CATEGORY[type.toLowerCase()]) ||
          "tourism.attraction,tourism.sights,catering.restaurant,leisure.park";

        const placesUrl =
          `https://api.geoapify.com/v2/places` +
          `?categories=${encodeURIComponent(category)}` +
          `&filter=circle:${coords.lon},${coords.lat},10000` +
          `&bias=proximity:${coords.lon},${coords.lat}` +
          `&limit=12` +
          `&apiKey=${apiKey.trim()}`;

        const placesRes = await fetch(placesUrl);
        if (!placesRes.ok) throw new Error(`Geoapify Places HTTP ${placesRes.status}`);
        const placesJson = await placesRes.json();

        const results = (placesJson.features || [])
          .map((f) => {
            const p = f.properties;
            const detectedType =
              Object.entries(TYPE_TO_GEOAPIFY_CATEGORY).find(([, cats]) =>
                cats.split(",").some((cat) =>
                  (p.categories || []).some((c) => c.startsWith(cat))
                )
              )?.[0] || type || "sightseeing";

            return {
              name: p.name || p.address_line1 || "Local Attraction",
              type: detectedType,
              estimatedCost: 0, // Geoapify doesn't provide cost — keep 0 as neutral
              description: [p.address_line1, p.address_line2].filter(Boolean).join(", ") ||
                `Popular ${detectedType} spot in ${city}.`,
              imageUrl: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600",
            };
          })
          .filter((a) => a.name && a.name !== "Local Attraction");

        if (results.length > 0) {
          let filtered = results;
          if (type) {
            const cleanType = type.trim().toLowerCase();
            filtered = results.filter((a) => a.type === cleanType);
            if (filtered.length === 0) filtered = results; // don't return empty if no match
          }
          if (maxCost !== undefined && !isNaN(maxCost)) {
            filtered = filtered.filter((a) => a.estimatedCost <= Number(maxCost));
          }
          return filtered;
        }
      }
    } catch (err) {
      console.warn("[geoapify.service] Live API failed, falling back to static:", err.message);
    }
  }

  // ── Static fallback ───────────────────────────────────────────────────────
  let list = [];

  if (city) {
    const cleanCity = city.trim().toLowerCase();
    const matchedKey = Object.keys(MOCK_ACTIVITIES_BY_CITY).find(
      (k) => cleanCity.includes(k) || k.includes(cleanCity)
    );
    if (matchedKey) {
      list = [...MOCK_ACTIVITIES_BY_CITY[matchedKey]];
    }
  }

  if (list.length === 0) {
    const cityName = city || "City";
    list = DEFAULT_ACTIVITIES.map((a) => ({
      ...a,
      name: `${cityName} ${a.name}`,
    }));
  }

  if (type) {
    const cleanType = type.trim().toLowerCase();
    list = list.filter((a) => a.type.toLowerCase() === cleanType);
  }

  if (maxCost !== undefined && maxCost !== null && !isNaN(maxCost)) {
    list = list.filter((a) => a.estimatedCost <= Number(maxCost));
  }

  return list;
};
