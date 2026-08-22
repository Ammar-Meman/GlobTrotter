import { CITIES_DATA } from "../data/cities.data.js";

/**
 * Searches cities using mock / stub lookup data.
 * @param {string} query
 * @returns {Promise<Array<{cityName: string, country: string, latitude: number, longitude: number, costIndex: number, popularity: number}>>}
 */
export const searchCities = async (query) => {
  if (!query || query.trim() === "") {
    return CITIES_DATA.slice(0, 10);
  }

  const cleanQuery = query.trim().toLowerCase();
  const matched = CITIES_DATA.filter(
    (c) =>
      c.cityName.toLowerCase().includes(cleanQuery) ||
      (c.country && c.country.toLowerCase().includes(cleanQuery))
  );

  if (matched.length > 0) {
    return matched;
  }

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
