// ── Curated static fallback for Indian destinations ───────────────────────────
const MOCK_CITY_IMAGES = {
  delhi: "https://images.pexels.com/photos/28678222/pexels-photo-28678222.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  jaipur: "https://images.pexels.com/photos/32261804/pexels-photo-32261804.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  agra: "https://images.pexels.com/photos/28119116/pexels-photo-28119116.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  varanasi: "https://images.pexels.com/photos/18728098/pexels-photo-18728098.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  srinagar: "https://images.pexels.com/photos/17764447/pexels-photo-17764447.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  amritsar: "https://images.pexels.com/photos/18275890/pexels-photo-18275890.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  rishikesh: "https://images.pexels.com/photos/19041828/pexels-photo-19041828.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  manali: "https://images.pexels.com/photos/28738431/pexels-photo-28738431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "leh ladakh": "https://images.pexels.com/photos/38087449/pexels-photo-38087449.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  leh: "https://images.pexels.com/photos/38087449/pexels-photo-38087449.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  mumbai: "https://images.pexels.com/photos/5414582/pexels-photo-5414582.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  goa: "https://images.pexels.com/photos/11438923/pexels-photo-11438923.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  udaipur: "https://images.pexels.com/photos/33658452/pexels-photo-33658452.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  jodhpur: "https://images.pexels.com/photos/27992777/pexels-photo-27992777.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  jaisalmer: "https://images.pexels.com/photos/35130760/pexels-photo-35130760.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  pune: "https://images.pexels.com/photos/14466391/pexels-photo-14466391.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  ahmedabad: "https://images.pexels.com/photos/38319031/pexels-photo-38319031.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  bengaluru: "https://images.pexels.com/photos/14845309/pexels-photo-14845309.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  kochi: "https://images.pexels.com/photos/36874163/pexels-photo-36874163.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  munnar: "https://images.pexels.com/photos/12530868/pexels-photo-12530868.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  alleppey: "https://images.pexels.com/photos/31746351/pexels-photo-31746351.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  mysore: "https://images.pexels.com/photos/34962788/pexels-photo-34962788.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  chennai: "https://images.pexels.com/photos/9432498/pexels-photo-9432498.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  hyderabad: "https://images.pexels.com/photos/30383863/pexels-photo-30383863.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  pondicherry: "https://images.pexels.com/photos/38199872/pexels-photo-38199872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  ooty: "https://images.pexels.com/photos/35866210/pexels-photo-35866210.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  hampi: "https://images.pexels.com/photos/31468455/pexels-photo-31468455.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  kolkata: "https://images.pexels.com/photos/30731597/pexels-photo-30731597.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  darjeeling: "https://images.pexels.com/photos/10440716/pexels-photo-10440716.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  shillong: "https://images.pexels.com/photos/35079186/pexels-photo-35079186.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  gangtok: "https://images.pexels.com/photos/14916663/pexels-photo-14916663.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  puri: "https://images.pexels.com/photos/33518945/pexels-photo-33518945.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  khajuraho: "https://images.pexels.com/photos/36558371/pexels-photo-36558371.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  bhopal: "https://images.pexels.com/photos/35424480/pexels-photo-35424480.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};

const DEFAULT_CITY_IMAGE =
  "https://images.pexels.com/photos/28678222/pexels-photo-28678222.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

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
      const query = encodeURIComponent(`${cityName.trim()} city India`);
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
          photo.src.large2x ||
          photo.src.large ||
          photo.src.landscape ||
          photo.src.medium ||
          DEFAULT_CITY_IMAGE;
        return { imageUrl };
      }
    } catch (err) {
      console.warn("[pexels.service] Live API failed, falling back to static:", err.message);
    }
  }

  // ── Static fallback ────────────────────────────────────────────────────────
  const clean = cityName.trim().toLowerCase();
  const matched = MOCK_CITY_IMAGES[clean];
  if (matched) return { imageUrl: matched };

  // Partial match
  const key = Object.keys(MOCK_CITY_IMAGES).find(
    (k) => clean.includes(k) || k.includes(clean)
  );
  if (key) return { imageUrl: MOCK_CITY_IMAGES[key] };

  return { imageUrl: DEFAULT_CITY_IMAGE };
};
