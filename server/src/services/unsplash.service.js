const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// ── Static mock fallback (unchanged from stub) ─────────────────────────────
const MOCK_CITY_IMAGES = {
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80",
  tokyo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80",
  "new york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&auto=format&fit=crop&q=80",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&auto=format&fit=crop&q=80",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&auto=format&fit=crop&q=80",
  barcelona: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&auto=format&fit=crop&q=80",
  kyoto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80",
  amsterdam: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200&auto=format&fit=crop&q=80",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop&q=80",
  singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&auto=format&fit=crop&q=80",
  bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&auto=format&fit=crop&q=80",
  sydney: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&auto=format&fit=crop&q=80",
  berlin: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&auto=format&fit=crop&q=80",
  prague: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=1200&auto=format&fit=crop&q=80",
  cairo: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200&auto=format&fit=crop&q=80",
  "rio de janeiro": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&auto=format&fit=crop&q=80",
  istanbul: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&auto=format&fit=crop&q=80",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80",
  venice: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=1200&auto=format&fit=crop&q=80",
  "san francisco": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&auto=format&fit=crop&q=80",
};

const DEFAULT_CITY_IMAGE =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80";

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gets a representative image URL for a city.
 * Uses Unsplash Search API when UNSPLASH_ACCESS_KEY is set.
 * Falls back to the static mock table otherwise.
 * @param {string} cityName
 * @returns {Promise<{ imageUrl: string }>}
 */
export const getCityImage = async (cityName) => {
  if (!cityName) return { imageUrl: DEFAULT_CITY_IMAGE };

  // ── Live path ─────────────────────────────────────────────────────────────
  if (UNSPLASH_ACCESS_KEY) {
    try {
      const query = encodeURIComponent(`${cityName} city travel landmark`);
      const url =
        `https://api.unsplash.com/search/photos` +
        `?query=${query}&per_page=1&orientation=landscape` +
        `&client_id=${UNSPLASH_ACCESS_KEY}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Unsplash HTTP ${response.status}`);
      const json = await response.json();

      const photo = json.results?.[0];
      if (photo?.urls?.regular) {
        // Prefer regular (1080px), add w param for consistent sizing
        const imageUrl = photo.urls.regular.includes("?")
          ? `${photo.urls.regular}&w=1200&q=80`
          : `${photo.urls.regular}?w=1200&q=80`;
        return { imageUrl };
      }
    } catch (err) {
      console.warn("[unsplash.service] Live API failed, falling back to static:", err.message);
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
