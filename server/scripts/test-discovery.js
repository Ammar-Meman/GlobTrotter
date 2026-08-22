import app from "../src/app.js";
import prisma from "../src/lib/prisma.js";
import { generateToken } from "../src/lib/jwt.js";
import * as geoapifyService from "../src/services/geoapify.service.js";
import * as pexelsService from "../src/services/pexels.service.js";

let server;
let baseUrl;
const testUserId = "test-user-uuid-1234";
const testToken = generateToken({ id: testUserId, email: "test@globetrotter.app" });

// Mock prisma.user.findUnique for auth middleware in isolated unit/integration test
prisma.user.findUnique = async ({ where }) => {
  if (where.id === testUserId || where.id) {
    return {
      id: where.id,
      email: "test@globetrotter.app",
      name: "Test User",
      photoUrl: null,
      language: "en",
      isAdmin: false,
    };
  }
  return null;
};

async function startServer() {
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`Test server running at ${baseUrl}`);
      resolve();
    });
  });
}

function stopServer() {
  if (server) server.close();
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

async function runTests() {
  try {
    await startServer();

    console.log("\n--- TEST 1: Service Unit Tests ---");

    // 1.1 City search static fallback
    const staticCities = await geoapifyService.searchCities("paris");
    assert(Array.isArray(staticCities) && staticCities.length > 0, "searchCities returns array for 'paris'");
    assert(staticCities[0].cityName === "Paris", "Paris city name matches");
    assert(typeof staticCities[0].costIndex === "number", "costIndex is a number");
    assert(typeof staticCities[0].popularity === "number", "popularity is a number");
    assert(typeof staticCities[0].latitude === "number", "latitude is a number");
    assert(typeof staticCities[0].longitude === "number", "longitude is a number");

    // 1.2 City search empty query
    const defaultCities = await geoapifyService.searchCities("");
    assert(Array.isArray(defaultCities) && defaultCities.length === 10, "Empty query returns top 10 cities");

    // 1.3 City search unknown city fallback
    const unknownCity = await geoapifyService.searchCities("Atlantis");
    assert(unknownCity.length === 1, "Unknown city returns fallback entry");
    assert(unknownCity[0].cityName === "Atlantis", "Fallback city name is formatted");
    assert(unknownCity[0].country === "Global Destination", "Fallback country is Global Destination");

    // 1.4 Activity search
    const activities = await geoapifyService.searchActivities({ city: "Paris", type: "sightseeing", maxCost: 50 });
    assert(Array.isArray(activities) && activities.length > 0, "searchActivities returns array");
    assert(activities.every(a => a.type === "sightseeing"), "All returned activities match 'sightseeing'");
    assert(activities.every(a => a.estimatedCost <= 50), "All returned activities cost <= 50");
    assert(typeof activities[0].name === "string", "Activity has name");
    assert(typeof activities[0].imageUrl === "string", "Activity has imageUrl");
    assert(typeof activities[0].description === "string", "Activity has description");

    // 1.5 Pexels image search fallback
    const pexelsFallback = await pexelsService.getCityImage("paris");
    assert(pexelsFallback && typeof pexelsFallback.imageUrl === "string", "getCityImage returns imageUrl");
    assert(pexelsFallback.imageUrl.includes("images.pexels.com"), "Curated image is from Pexels");

    const defaultImage = await pexelsService.getCityImage("UnknownCityXYZ");
    assert(defaultImage && typeof defaultImage.imageUrl === "string", "Unknown city returns default image");
    assert(defaultImage.imageUrl.includes("images.pexels.com"), "Default image is from Pexels");

    console.log("\n--- TEST 2: API Endpoints & Response Shapes ---");

    // 2.1 GET /api/cities/search
    const cityRes = await fetch(`${baseUrl}/api/cities/search?q=tokyo`, {
      headers: { Authorization: `Bearer ${testToken}` }
    });
    assert(cityRes.status === 200, "GET /api/cities/search returns 200");
    const cityData = await cityRes.json();
    assert(cityData.success === true, "Response has success: true");
    assert(Array.isArray(cityData.data), "Response data is array");
    assert(cityData.data[0].cityName === "Tokyo", "First result is Tokyo");
    assert(
      "cityName" in cityData.data[0] &&
      "country" in cityData.data[0] &&
      "latitude" in cityData.data[0] &&
      "longitude" in cityData.data[0] &&
      "costIndex" in cityData.data[0] &&
      "popularity" in cityData.data[0],
      "City response shape conforms strictly to API contract"
    );

    // 2.2 GET /api/activities/search
    const actRes = await fetch(`${baseUrl}/api/activities/search?city=Rome&type=food`, {
      headers: { Authorization: `Bearer ${testToken}` }
    });
    assert(actRes.status === 200, "GET /api/activities/search returns 200");
    const actData = await actRes.json();
    assert(actData.success === true, "Activity response has success: true");
    assert(Array.isArray(actData.data), "Activity response data is array");
    assert(actData.data.length > 0, "Found activities for Rome food");
    assert(
      "name" in actData.data[0] &&
      "type" in actData.data[0] &&
      "estimatedCost" in actData.data[0] &&
      "description" in actData.data[0] &&
      "imageUrl" in actData.data[0],
      "Activity response shape conforms strictly to API contract"
    );

    // 2.3 GET /api/cities/:cityName/image
    const imgRes = await fetch(`${baseUrl}/api/cities/barcelona/image`, {
      headers: { Authorization: `Bearer ${testToken}` }
    });
    assert(imgRes.status === 200, "GET /api/cities/:cityName/image returns 200");
    const imgData = await imgRes.json();
    assert(imgData.success === true, "Image response has success: true");
    assert(typeof imgData.data?.imageUrl === "string", "Image response data has imageUrl string");
    assert("imageUrl" in imgData.data && Object.keys(imgData.data).length === 1, "Image response shape strictly matches contract { imageUrl }");

    // 2.4 Test live simulation when API key is provided and when mock fetch fails
    console.log("\n--- TEST 3: Pexels and Geoapify Live Handling & Error Fallback ---");

    // Test with mock global fetch to verify live Geoapify parsing & fallback
    const originalFetch = globalThis.fetch;
    
    // Simulate Geoapify Geocoding API success
    globalThis.fetch = async (url, options) => {
      if (typeof url === "string" && url.includes("api.geoapify.com/v1/geocode/search")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  city: "Lyon",
                  country: "France",
                  lat: 45.75,
                  lon: 4.85,
                  formatted: "Lyon, France"
                },
                geometry: {
                  coordinates: [4.85, 45.75]
                }
              }
            ]
          })
        };
      }
      if (typeof url === "string" && url.includes("api.pexels.com/v1/search")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            photos: [
              {
                id: 99999,
                src: {
                  landscape: "https://images.pexels.com/photos/99999/live-landscape.jpg?w=1200",
                  large: "https://images.pexels.com/photos/99999/live-large.jpg"
                }
              }
            ]
          })
        };
      }
      return originalFetch(url, options);
    };

    // Temporarily set keys in env
    process.env.GEOAPIFY_API_KEY = "test-geoapify-key";
    process.env.PEXELS_API_KEY = "test-pexels-key";

    const liveCities = await geoapifyService.searchCities("Lyon");
    assert(liveCities.length > 0 && liveCities[0].cityName === "Lyon", "Live Geoapify returns parsed city result");
    assert(liveCities[0].latitude === 45.75 && liveCities[0].longitude === 4.85, "Live Geoapify coordinates correctly parsed");

    const liveImg = await pexelsService.getCityImage("Lyon");
    assert(liveImg.imageUrl === "https://images.pexels.com/photos/99999/live-landscape.jpg?w=1200", "Live Pexels returns landscape image");

    // Test when live API returns 500 error -> graceful fallback
    globalThis.fetch = async (url, options) => {
      if (typeof url === "string" && (url.includes("api.geoapify.com") || url.includes("api.pexels.com"))) {
        return {
          ok: false,
          status: 500,
          json: async () => ({ error: "Server error" })
        };
      }
      return originalFetch(url, options);
    };

    const fallbackCityOn500 = await geoapifyService.searchCities("Paris");
    assert(fallbackCityOn500.length > 0 && fallbackCityOn500[0].cityName === "Paris", "Geoapify 500 triggers graceful fallback to static lookup");

    const fallbackImgOn500 = await pexelsService.getCityImage("Paris");
    assert(fallbackImgOn500.imageUrl.includes("images.pexels.com"), "Pexels 500 triggers graceful fallback to curated image");

    // Reset
    globalThis.fetch = originalFetch;
    process.env.GEOAPIFY_API_KEY = "";
    process.env.PEXELS_API_KEY = "";

    console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!\n");
  } finally {
    stopServer();
  }
}

runTests();
