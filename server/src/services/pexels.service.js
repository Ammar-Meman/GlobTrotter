// ── Curated static fallback ──────────────────────────────────────────────────
const MOCK_CITY_IMAGES = {
  paris: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1200",
  tokyo: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "new york": "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1200",
  london: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1200",
  rome: "https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=1200",
  barcelona: "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=1200",
  kyoto: "https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=1200",
  amsterdam: "https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg?auto=compress&cs=tinysrgb&w=1200",
  dubai: "https://images.pexels.com/photos/1470405/pexels-photo-1470405.jpeg?auto=compress&cs=tinysrgb&w=1200",
  singapore: "https://images.pexels.com/photos/777059/pexels-photo-777059.jpeg?auto=compress&cs=tinysrgb&w=1200",
  bangkok: "https://images.pexels.com/photos/1682748/pexels-photo-1682748.jpeg?auto=compress&cs=tinysrgb&w=1200",
  sydney: "https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg?auto=compress&cs=tinysrgb&w=1200",
  berlin: "https://images.pexels.com/photos/2570063/pexels-photo-2570063.jpeg?auto=compress&cs=tinysrgb&w=1200",
  prague: "https://images.pexels.com/photos/161853/prague-czech-republic-city-161853.jpeg?auto=compress&cs=tinysrgb&w=1200",
  cairo: "https://images.pexels.com/photos/71241/pexels-photo-71241.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "rio de janeiro": "https://images.pexels.com/photos/2868242/pexels-photo-2868242.jpeg?auto=compress&cs=tinysrgb&w=1200",
  istanbul: "https://images.pexels.com/photos/1549326/pexels-photo-1549326.jpeg?auto=compress&cs=tinysrgb&w=1200",
  bali: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=1200",
  venice: "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "san francisco": "https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

const DEFAULT_CITY_IMAGE =
  "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1200";

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gets a representative image URL for a city.
 * Uses Pexels Search API when PEXELS_API_KEY is set.
 * Falls back to the curated mock table otherwise.
 * @param {string} cityName
 * @returns {Promise<{ imageUrl: string }>}
 */
export const getCityImage = async (cityName) => {
  if (!cityName) return { imageUrl: DEFAULT_CITY_IMAGE };

  const apiKey = process.env.PEXELS_API_KEY;

  // ── Live path ─────────────────────────────────────────────────────────────
  if (apiKey && apiKey.trim() !== "") {
    try {
      const query = encodeURIComponent(`${cityName} city landmark`);
      const url = `https://api.pexels.com/v1/search?query=${query}&per_page=1&orientation=landscape`;

      const response = await fetch(url, {
        headers: {
          Authorization: apiKey.trim(),
        },
      });

      if (!response.ok) throw new Error(`Pexels HTTP ${response.status}`);
      const json = await response.json();

      const photo = json.photos?.[0];
      if (photo?.src) {
        const imageUrl =
          photo.src.landscape ||
          photo.src.large2x ||
          photo.src.large ||
          photo.src.original ||
          photo.src.medium;

        if (imageUrl) {
          return { imageUrl };
        }
      }
    } catch (err) {
      console.warn("[pexels.service] Live API failed, falling back to static:", err.message);
    }
  }

  // ── Static fallback ───────────────────────────────────────────────────────
  const clean = cityName.trim().toLowerCase();
  const matchedKey = Object.keys(MOCK_CITY_IMAGES).find(
    (k) => clean.includes(k) || k.includes(clean)
  );

  if (matchedKey) return { imageUrl: MOCK_CITY_IMAGES[matchedKey] };
  return { imageUrl: DEFAULT_CITY_IMAGE };
};
