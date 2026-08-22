import { CITIES_DATA } from "../data/cities.data.js";

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

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
  return {
    cityName,
    country: country || staticEntry?.country || "Unknown",
    latitude: lat,
    longitude: lon,
    costIndex: staticEntry?.costIndex ?? 50.0,
    popularity: staticEntry?.popularity ?? 70,
  };
}

/**
 * Calls Mapbox Geocoding API if MAPBOX_TOKEN is set, otherwise falls back to
 * static CITIES_DATA lookup.
 * @param {string} query
 * @returns {Promise<Array<{cityName,country,latitude,longitude,costIndex,popularity}>>}
 */
export const searchCities = async (query) => {
  // ── Live path ─────────────────────────────────────────────────────────────
  if (MAPBOX_TOKEN && query && query.trim() !== "") {
    try {
      const encoded = encodeURIComponent(query.trim());
      const url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json` +
        `?types=place&language=en&limit=8&access_token=${MAPBOX_TOKEN}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Mapbox HTTP ${response.status}`);
      const json = await response.json();

      const results = (json.features || []).map((feature) => {
        const [lon, lat] = feature.center;
        const cityName = feature.text || feature.place_name.split(",")[0].trim();
        const contextCountry = (feature.context || []).find((c) =>
          c.id.startsWith("country.")
        );
        const country = contextCountry?.text || "";
        return mergeWithStaticData(cityName, country, lat, lon);
      });

      if (results.length > 0) return results;
      // fall through to static if Mapbox returned nothing
    } catch (err) {
      console.warn("[mapbox.service] Live API failed, falling back to static:", err.message);
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

  // Unknown city fallback
  const capitalized = query.charAt(0).toUpperCase() + query.slice(1);
  return [
    {
      cityName: capitalized,
      country: "Global Destination",
      latitude: 0.0,
      longitude: 0.0,
      costIndex: 50.0,
      popularity: 70,
    },
  ];
};
