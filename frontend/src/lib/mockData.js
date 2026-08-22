// ─── Mock User ───────────────────────────────────────────────
let MOCK_USER = {
  id: "user-123",
  name: "Daksh Sharma",
  email: "daksh@globetrotter.app",
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  language: "en",
  isAdmin: false,
};

// ─── City Search Database (~20 major cities) ─────────────────
const MOCK_CITIES = [
  { cityName: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522, costIndex: 72.5, popularity: 95 },
  { cityName: "Rome", country: "Italy", latitude: 41.9028, longitude: 12.4964, costIndex: 65.0, popularity: 92 },
  { cityName: "Barcelona", country: "Spain", latitude: 41.3879, longitude: 2.1699, costIndex: 58.0, popularity: 90 },
  { cityName: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503, costIndex: 78.0, popularity: 98 },
  { cityName: "Kyoto", country: "Japan", latitude: 35.0116, longitude: 135.7681, costIndex: 68.0, popularity: 88 },
  { cityName: "New York", country: "United States", latitude: 40.7128, longitude: -74.006, costIndex: 85.0, popularity: 97 },
  { cityName: "London", country: "United Kingdom", latitude: 51.5074, longitude: -0.1278, costIndex: 80.0, popularity: 96 },
  { cityName: "Bangkok", country: "Thailand", latitude: 13.7563, longitude: 100.5018, costIndex: 35.0, popularity: 89 },
  { cityName: "Istanbul", country: "Turkey", latitude: 41.0082, longitude: 28.9784, costIndex: 42.0, popularity: 85 },
  { cityName: "Dubai", country: "UAE", latitude: 25.2048, longitude: 55.2708, costIndex: 75.0, popularity: 91 },
  { cityName: "Singapore", country: "Singapore", latitude: 1.3521, longitude: 103.8198, costIndex: 76.0, popularity: 87 },
  { cityName: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093, costIndex: 78.0, popularity: 86 },
  { cityName: "Amsterdam", country: "Netherlands", latitude: 52.3676, longitude: 4.9041, costIndex: 70.0, popularity: 84 },
  { cityName: "Prague", country: "Czech Republic", latitude: 50.0755, longitude: 14.4378, costIndex: 45.0, popularity: 82 },
  { cityName: "Lisbon", country: "Portugal", latitude: 38.7223, longitude: -9.1393, costIndex: 50.0, popularity: 83 },
  { cityName: "Berlin", country: "Germany", latitude: 52.52, longitude: 13.405, costIndex: 55.0, popularity: 81 },
  { cityName: "Vienna", country: "Austria", latitude: 48.2082, longitude: 16.3738, costIndex: 62.0, popularity: 80 },
  { cityName: "Mumbai", country: "India", latitude: 19.076, longitude: 72.8777, costIndex: 30.0, popularity: 78 },
  { cityName: "Cairo", country: "Egypt", latitude: 30.0444, longitude: 31.2357, costIndex: 28.0, popularity: 77 },
  { cityName: "Marrakech", country: "Morocco", latitude: 31.6295, longitude: -7.9811, costIndex: 32.0, popularity: 76 },
];

// ─── Activity Suggestions (keyed by city) ────────────────────
const MOCK_ACTIVITY_SUGGESTIONS = {
  Paris: [
    { name: "Louvre Museum Tour", type: "sightseeing", estimatedCost: 25, description: "World's largest art museum with the Mona Lisa", imageUrl: "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=600&auto=format&fit=crop&q=80" },
    { name: "Eiffel Tower Summit", type: "sightseeing", estimatedCost: 30, description: "Panoramic views from the top of the iron lady", imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce65f8?w=600&auto=format&fit=crop&q=80" },
    { name: "Seine River Dinner Cruise", type: "food", estimatedCost: 85, description: "3-course French dining with illuminated views", imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80" },
    { name: "Montmartre Walking Tour", type: "sightseeing", estimatedCost: 15, description: "Explore the bohemian artist quarter and Sacré-Cœur", imageUrl: "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=600&auto=format&fit=crop&q=80" },
    { name: "French Pastry Workshop", type: "food", estimatedCost: 55, description: "Learn to make croissants and macarons with a local chef", imageUrl: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&auto=format&fit=crop&q=80" },
  ],
  Rome: [
    { name: "Colosseum & Roman Forum", type: "sightseeing", estimatedCost: 28, description: "Gladiator arena underground access and ancient ruins walk", imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80" },
    { name: "Vatican Museums & Sistine Chapel", type: "sightseeing", estimatedCost: 25, description: "Renaissance masterpieces and Michelangelo's ceiling", imageUrl: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&auto=format&fit=crop&q=80" },
    { name: "Trastevere Food Tour", type: "food", estimatedCost: 65, description: "Taste authentic Roman cuisine in the liveliest neighborhood", imageUrl: "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=600&auto=format&fit=crop&q=80" },
    { name: "Vespa City Tour", type: "adventure", estimatedCost: 70, description: "Zip through Rome's streets on an iconic Italian scooter", imageUrl: "https://images.unsplash.com/photo-1525874684015-58379d421a52?w=600&auto=format&fit=crop&q=80" },
  ],
  Barcelona: [
    { name: "Sagrada Familia Tour", type: "architecture", estimatedCost: 30, description: "Gaudí's masterpiece basilica with tower access", imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&auto=format&fit=crop&q=80" },
    { name: "La Boqueria Market Tour", type: "food", estimatedCost: 35, description: "Taste your way through Barcelona's most famous market", imageUrl: "https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=600&auto=format&fit=crop&q=80" },
    { name: "Beach Kayak & Snorkel", type: "adventure", estimatedCost: 45, description: "Paddle along the Barcelona coast and explore sea life", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80" },
    { name: "Gothic Quarter Walking Tour", type: "sightseeing", estimatedCost: 20, description: "Medieval streets, hidden plazas, and Roman ruins", imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&auto=format&fit=crop&q=80" },
  ],
  Tokyo: [
    { name: "Tsukiji Outer Market Food Tour", type: "food", estimatedCost: 40, description: "Sushi, tamagoyaki, and street food with a local guide", imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=80" },
    { name: "TeamLab Borderless", type: "sightseeing", estimatedCost: 30, description: "Immersive digital art museum experience", imageUrl: "https://images.unsplash.com/photo-1549693578-d683be217e58?w=600&auto=format&fit=crop&q=80" },
    { name: "Shibuya & Harajuku Walk", type: "sightseeing", estimatedCost: 0, description: "Iconic crossing, street fashion, and Meiji Shrine", imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&auto=format&fit=crop&q=80" },
  ],
  _default: [
    { name: "City Walking Tour", type: "sightseeing", estimatedCost: 15, description: "Explore the city highlights with a knowledgeable guide", imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=80" },
    { name: "Local Food Experience", type: "food", estimatedCost: 40, description: "Taste authentic local cuisine at hidden gem restaurants", imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=80" },
    { name: "Museum & Gallery Pass", type: "sightseeing", estimatedCost: 20, description: "Access to the city's top museums and galleries", imageUrl: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=600&auto=format&fit=crop&q=80" },
  ],
};

// ─── Enriched Mock Trips ─────────────────────────────────────
let MOCK_TRIPS = [
  {
    id: "trip-1",
    name: "Summer European Grand Tour",
    startDate: "2026-06-01T00:00:00.000Z",
    endDate: "2026-06-15T00:00:00.000Z",
    description: "Iconic backpacking journey through Paris, Rome, and Barcelona with museum tours and culinary explorations.",
    coverPhoto: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&auto=format&fit=crop&q=80",
    budgetLimit: 3000,
    stopCount: 3,
    isPublic: true,
    shareId: "share-euro-2026",
    userId: "user-123",
    createdAt: "2026-05-10T10:00:00.000Z",
    stops: [
      {
        id: "stop-1",
        cityName: "Paris",
        country: "France",
        latitude: 48.8566,
        longitude: 2.3522,
        costIndex: 72.5,
        popularity: 95,
        startDate: "2026-06-01T00:00:00.000Z",
        endDate: "2026-06-05T00:00:00.000Z",
        order: 1,
        activities: [
          {
            id: "act-1", name: "Airport Transfer to Hotel", type: "transfer", category: "transport",
            cost: 60, duration: 45, description: "Private car from CDG airport to Le Marais district.",
            imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80",
            order: 1, scheduledAt: "2026-06-01T10:00:00.000Z",
          },
          {
            id: "act-2", name: "Hotel Le Marais Check-in", type: "hotel", category: "stay",
            cost: 580, duration: 0, description: "4-night stay at boutique hotel in the heart of Le Marais.",
            imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
            order: 2, scheduledAt: "2026-06-01T14:00:00.000Z",
          },
          {
            id: "act-3", name: "Louvre Museum Guided Tour", type: "sightseeing", category: "activity",
            cost: 35, duration: 180, description: "Explore the Mona Lisa and classical sculptures with an art historian.",
            imageUrl: "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=600&auto=format&fit=crop&q=80",
            order: 3, scheduledAt: "2026-06-02T09:00:00.000Z",
          },
          {
            id: "act-4", name: "Seine Sunset Dinner Cruise", type: "food", category: "meal",
            cost: 85, duration: 120, description: "3-course French dining cruise overlooking the illuminated Eiffel Tower.",
            imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80",
            order: 4, scheduledAt: "2026-06-02T19:00:00.000Z",
          },
          {
            id: "act-5", name: "Eiffel Tower Summit Visit", type: "sightseeing", category: "activity",
            cost: 30, duration: 90, description: "Panoramic views from the top of the iron lady.",
            imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce65f8?w=600&auto=format&fit=crop&q=80",
            order: 5, scheduledAt: "2026-06-03T10:00:00.000Z",
          },
          {
            id: "act-6", name: "Café Croissant Breakfast", type: "food", category: "meal",
            cost: 18, duration: 60, description: "Classic Parisian breakfast at a neighborhood café.",
            imageUrl: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&auto=format&fit=crop&q=80",
            order: 6, scheduledAt: "2026-06-03T08:00:00.000Z",
          },
          {
            id: "act-7", name: "Train to Rome", type: "train", category: "transport",
            cost: 90, duration: 720, description: "High-speed TGV to Termini station.",
            imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&auto=format&fit=crop&q=80",
            order: 7, scheduledAt: "2026-06-05T07:00:00.000Z",
          },
        ],
      },
      {
        id: "stop-2",
        cityName: "Rome",
        country: "Italy",
        latitude: 41.9028,
        longitude: 12.4964,
        costIndex: 65.0,
        popularity: 92,
        startDate: "2026-06-05T00:00:00.000Z",
        endDate: "2026-06-10T00:00:00.000Z",
        order: 2,
        activities: [
          {
            id: "act-8", name: "Boutique Hotel Roma", type: "hotel", category: "stay",
            cost: 480, duration: 0, description: "5-night stay near Piazza Navona.",
            imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=80",
            order: 1, scheduledAt: "2026-06-05T15:00:00.000Z",
          },
          {
            id: "act-9", name: "Colosseum & Roman Forum", type: "sightseeing", category: "activity",
            cost: 28, duration: 150, description: "Gladiator arena underground access and ancient ruins walk.",
            imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80",
            order: 2, scheduledAt: "2026-06-06T09:00:00.000Z",
          },
          {
            id: "act-10", name: "Trastevere Food Tour", type: "food", category: "meal",
            cost: 65, duration: 180, description: "Taste authentic Roman cuisine in the liveliest neighborhood.",
            imageUrl: "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=600&auto=format&fit=crop&q=80",
            order: 3, scheduledAt: "2026-06-07T12:00:00.000Z",
          },
          {
            id: "act-11", name: "Vatican Museums & Sistine Chapel", type: "sightseeing", category: "activity",
            cost: 25, duration: 180, description: "Renaissance masterpieces and Michelangelo's ceiling.",
            imageUrl: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&auto=format&fit=crop&q=80",
            order: 4, scheduledAt: "2026-06-08T09:30:00.000Z",
          },
          {
            id: "act-12", name: "Train to Barcelona", type: "train", category: "transport",
            cost: 75, duration: 660, description: "Scenic rail journey along the Mediterranean coast.",
            imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&auto=format&fit=crop&q=80",
            order: 5, scheduledAt: "2026-06-10T06:00:00.000Z",
          },
        ],
      },
      {
        id: "stop-3",
        cityName: "Barcelona",
        country: "Spain",
        latitude: 41.3879,
        longitude: 2.1699,
        costIndex: 58.0,
        popularity: 90,
        startDate: "2026-06-10T00:00:00.000Z",
        endDate: "2026-06-15T00:00:00.000Z",
        order: 3,
        activities: [
          {
            id: "act-13", name: "Airbnb Gothic Quarter", type: "apartment", category: "stay",
            cost: 420, duration: 0, description: "Stylish apartment in the medieval Gothic Quarter.",
            imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
            order: 1, scheduledAt: "2026-06-10T16:00:00.000Z",
          },
          {
            id: "act-14", name: "Sagrada Familia Audio Guided Tour", type: "architecture", category: "activity",
            cost: 30, duration: 90, description: "Gaudí masterpiece basilica with tower views.",
            imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&auto=format&fit=crop&q=80",
            order: 2, scheduledAt: "2026-06-11T10:00:00.000Z",
          },
          {
            id: "act-15", name: "La Boqueria Market Lunch", type: "food", category: "meal",
            cost: 35, duration: 90, description: "Fresh seafood and tapas at Barcelona's most famous market.",
            imageUrl: "https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=600&auto=format&fit=crop&q=80",
            order: 3, scheduledAt: "2026-06-12T12:30:00.000Z",
          },
          {
            id: "act-16", name: "Beach Kayak & Snorkel", type: "adventure", category: "activity",
            cost: 45, duration: 180, description: "Paddle along the Barcelona coast and explore sea life.",
            imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80",
            order: 4, scheduledAt: "2026-06-13T09:00:00.000Z",
          },
          {
            id: "act-17", name: "Airport Taxi", type: "taxi", category: "transport",
            cost: 40, duration: 30, description: "Transfer to Barcelona El Prat International Airport.",
            imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80",
            order: 5, scheduledAt: "2026-06-15T06:00:00.000Z",
          },
        ],
      },
    ],
  },
  {
    id: "trip-2",
    name: "Autumn in Kyoto & Tokyo",
    startDate: "2026-10-12T00:00:00.000Z",
    endDate: "2026-10-24T00:00:00.000Z",
    description: "Fall foliage, ancient temples, tea ceremonies, and vibrant futuristic neon streets.",
    coverPhoto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80",
    budgetLimit: 4200,
    stopCount: 2,
    isPublic: false,
    shareId: "share-japan-2026",
    userId: "user-123",
    createdAt: "2026-05-12T14:30:00.000Z",
    stops: [
      {
        id: "stop-j1",
        cityName: "Kyoto",
        country: "Japan",
        latitude: 35.0116,
        longitude: 135.7681,
        costIndex: 68.0,
        popularity: 88,
        startDate: "2026-10-12T00:00:00.000Z",
        endDate: "2026-10-18T00:00:00.000Z",
        order: 1,
        activities: [
          {
            id: "act-j1", name: "Ryokan Traditional Inn", type: "hotel", category: "stay",
            cost: 780, duration: 0, description: "6-night stay at a traditional Japanese inn with onsen.",
            imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=80",
            order: 1, scheduledAt: "2026-10-12T15:00:00.000Z",
          },
          {
            id: "act-j2", name: "Fushimi Inari Shrine Hike", type: "sightseeing", category: "activity",
            cost: 0, duration: 180, description: "Walk through thousands of vermilion torii gates.",
            imageUrl: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600&auto=format&fit=crop&q=80",
            order: 2, scheduledAt: "2026-10-13T07:00:00.000Z",
          },
          {
            id: "act-j3", name: "Tea Ceremony Experience", type: "culture", category: "activity",
            cost: 45, duration: 90, description: "Traditional matcha ceremony in a Zen garden setting.",
            imageUrl: "https://images.unsplash.com/photo-1545048702-79362596cdc9?w=600&auto=format&fit=crop&q=80",
            order: 3, scheduledAt: "2026-10-14T14:00:00.000Z",
          },
        ],
      },
      {
        id: "stop-j2",
        cityName: "Tokyo",
        country: "Japan",
        latitude: 35.6762,
        longitude: 139.6503,
        costIndex: 78.0,
        popularity: 98,
        startDate: "2026-10-18T00:00:00.000Z",
        endDate: "2026-10-24T00:00:00.000Z",
        order: 2,
        activities: [
          {
            id: "act-j4", name: "Shinkansen Kyoto → Tokyo", type: "train", category: "transport",
            cost: 120, duration: 135, description: "Bullet train ride through the Japanese countryside.",
            imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&auto=format&fit=crop&q=80",
            order: 1, scheduledAt: "2026-10-18T08:00:00.000Z",
          },
          {
            id: "act-j5", name: "Capsule Hotel Shibuya", type: "hotel", category: "stay",
            cost: 360, duration: 0, description: "6-night stay at a modern capsule hotel in Shibuya.",
            imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=80",
            order: 2, scheduledAt: "2026-10-18T14:00:00.000Z",
          },
          {
            id: "act-j6", name: "Tsukiji Market Food Tour", type: "food", category: "meal",
            cost: 55, duration: 180, description: "Sushi, tamagoyaki, and street food with a local guide.",
            imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&auto=format&fit=crop&q=80",
            order: 3, scheduledAt: "2026-10-19T06:00:00.000Z",
          },
          {
            id: "act-j7", name: "TeamLab Borderless", type: "sightseeing", category: "activity",
            cost: 30, duration: 120, description: "Immersive digital art museum experience.",
            imageUrl: "https://images.unsplash.com/photo-1549693578-d683be217e58?w=600&auto=format&fit=crop&q=80",
            order: 4, scheduledAt: "2026-10-20T11:00:00.000Z",
          },
        ],
      },
    ],
  },
];

let MOCK_SAVED_DESTINATIONS = [
  { id: "sd-1", cityName: "Kyoto" },
  { id: "sd-2", cityName: "Reykjavik" },
  { id: "sd-3", cityName: "Zurich" },
  { id: "sd-4", cityName: "Vancouver" },
];

// ─── Helper Utilities ────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const uid = () => crypto.randomUUID ? crypto.randomUUID() : "id-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);

function parseBody(options) {
  if (!options.body) return {};
  return typeof options.body === "string" ? JSON.parse(options.body) : options.body;
}

function findTripByStop(stopId) {
  return MOCK_TRIPS.find((t) => t.stops?.some((s) => s.id === stopId));
}

function findTrip(tripId) {
  return MOCK_TRIPS.find((t) => t.id === tripId);
}

function computeBudget(trip) {
  const allActivities = (trip.stops || []).flatMap((s) => s.activities || []);
  const totalCost = allActivities.reduce((sum, a) => sum + (a.cost || 0), 0);

  const byCategory = { transport: 0, stay: 0, activity: 0, meal: 0 };
  allActivities.forEach((a) => {
    if (byCategory[a.category] !== undefined) byCategory[a.category] += a.cost || 0;
  });

  // Group by day using scheduledAt
  const dayMap = {};
  allActivities.forEach((a) => {
    const date = a.scheduledAt ? a.scheduledAt.slice(0, 10) + "T00:00:00.000Z" : null;
    if (date) {
      dayMap[date] = (dayMap[date] || 0) + (a.cost || 0);
    }
  });

  const threshold = trip.budgetLimit ? trip.budgetLimit / Math.max(1, Object.keys(dayMap).length) : 150;
  const byDay = Object.entries(dayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, cost]) => ({ date, cost, overBudget: cost > threshold }));

  const averagePerDay = byDay.length ? +(totalCost / byDay.length).toFixed(1) : 0;

  return { totalCost, byCategory, byDay, averagePerDay, dailyBudgetThreshold: +threshold.toFixed(0) };
}

// ─── Mock API Router ─────────────────────────────────────────
export async function mockApi(endpoint, options = {}) {
  await delay(300);

  const method = options.method || "GET";
  const body = parseBody(options);

  // ── Auth Routes ──────────────────────────────────────────
  if (endpoint === "/auth/login" && method === "POST") {
    return { token: "mock-jwt-token-globetrotter-123", user: MOCK_USER };
  }
  if (endpoint === "/auth/signup" && method === "POST") {
    MOCK_USER = { ...MOCK_USER, name: body.name || MOCK_USER.name, email: body.email || MOCK_USER.email };
    return { token: "mock-jwt-token-globetrotter-123", user: MOCK_USER };
  }
  if (endpoint === "/auth/forgot-password" && method === "POST") {
    return { message: "reset link sent" };
  }
  if (endpoint === "/auth/me" && method === "GET") {
    if (!localStorage.getItem("token")) throw { code: "UNAUTHORIZED", message: "Missing authorization token" };
    return MOCK_USER;
  }

  // ── Upload ───────────────────────────────────────────────
  if (endpoint === "/uploads" && method === "POST") {
    return { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80" };
  }

  // ── User Profile ─────────────────────────────────────────
  if (endpoint === "/users/me" && method === "PUT") {
    MOCK_USER = { ...MOCK_USER, ...body };
    return MOCK_USER;
  }

  if (endpoint === "/users/me" && method === "DELETE") {
    MOCK_TRIPS = [];
    return { message: "account deleted" };
  }

  // Saved Destinations Routes
  if (endpoint === "/users/me/saved-destinations" && method === "GET") {
    return MOCK_SAVED_DESTINATIONS;
  }

  if (endpoint === "/users/me/saved-destinations" && method === "POST") {
    const body = options.body ? (typeof options.body === "string" ? JSON.parse(options.body) : options.body) : {};
    const newDest = { id: "sd-" + Date.now(), cityName: body.cityName || "New Destination" };
    MOCK_SAVED_DESTINATIONS.push(newDest);
    return newDest;
  }

  const savedDestMatch = endpoint.match(/^\/users\/me\/saved-destinations\/([^/]+)$/);
  if (savedDestMatch && method === "DELETE") {
    const id = savedDestMatch[1];
    MOCK_SAVED_DESTINATIONS = MOCK_SAVED_DESTINATIONS.filter((d) => d.id !== id);
    return { message: "removed" };
  }

  // ── City Search: GET /cities/search?q=... ────────────────
  const citySearchMatch = endpoint.match(/^\/cities\/search/);
  if (citySearchMatch && method === "GET") {
    const url = new URL("http://x" + endpoint);
    const q = (url.searchParams.get("q") || "").toLowerCase();
    if (!q) return [];
    return MOCK_CITIES.filter(
      (c) => c.cityName.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    );
  }

  // ── City Image: GET /cities/:cityName/image ──────────────
  const cityImageMatch = endpoint.match(/^\/cities\/([^/]+)\/image$/);
  if (cityImageMatch && method === "GET") {
    return { imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop&q=80" };
  }

  // ── Activity Search: GET /activities/search?city=...&type=...&maxCost=... ──
  const actSearchMatch = endpoint.match(/^\/activities\/search/);
  if (actSearchMatch && method === "GET") {
    const url = new URL("http://x" + endpoint);
    const city = url.searchParams.get("city") || "";
    const type = url.searchParams.get("type") || "";
    const maxCost = url.searchParams.get("maxCost");
    let results = MOCK_ACTIVITY_SUGGESTIONS[city] || MOCK_ACTIVITY_SUGGESTIONS._default;
    if (type) results = results.filter((r) => r.type.toLowerCase().includes(type.toLowerCase()));
    if (maxCost) results = results.filter((r) => r.estimatedCost <= Number(maxCost));
    return results;
  }

  // ── Trips: GET /trips ────────────────────────────────────
  if (endpoint === "/trips" && method === "GET") {
    return MOCK_TRIPS.map((t) => ({
      id: t.id, name: t.name, startDate: t.startDate, endDate: t.endDate,
      description: t.description, coverPhoto: t.coverPhoto, budgetLimit: t.budgetLimit,
      stopCount: t.stops ? t.stops.length : t.stopCount || 0, createdAt: t.createdAt,
    }));
  }

  // ── Trips: POST /trips ───────────────────────────────────
  if (endpoint === "/trips" && method === "POST") {
    const newTrip = {
      id: "trip-" + uid(), name: body.name || "Untitled Journey",
      startDate: body.startDate || new Date().toISOString(),
      endDate: body.endDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      description: body.description || "", coverPhoto: body.coverPhoto || "",
      budgetLimit: body.budgetLimit ? Number(body.budgetLimit) : null,
      shareId: "share-" + uid(), isPublic: false, userId: MOCK_USER.id,
      createdAt: new Date().toISOString(), stops: [], stopCount: 0,
    };
    MOCK_TRIPS.unshift(newTrip);
    return newTrip;
  }

  // ── Public Share: GET /trips/public/:shareId ─────────────
  const publicShareMatch = endpoint.match(/^\/trips\/public\/([^/]+)$/);
  if (publicShareMatch && method === "GET") {
    const shareId = publicShareMatch[1];
    const trip = MOCK_TRIPS.find((t) => t.shareId === shareId && t.isPublic);
    if (!trip) throw { code: "NOT_FOUND", message: "Trip not found or not public" };
    const { userId, ...rest } = trip;
    return rest;
  }

  // ── Stops Reorder: PUT /trips/:tripId/stops/reorder ──────
  const stopsReorderMatch = endpoint.match(/^\/trips\/([^/]+)\/stops\/reorder$/);
  if (stopsReorderMatch && method === "PUT") {
    const tripId = stopsReorderMatch[1];
    const trip = findTrip(tripId);
    if (!trip) throw { code: "NOT_FOUND", message: "Trip not found" };
    const { stopIds } = body;
    const reordered = stopIds.map((sid, i) => {
      const stop = trip.stops.find((s) => s.id === sid);
      return stop ? { ...stop, order: i + 1 } : null;
    }).filter(Boolean);
    trip.stops = reordered;
    return { message: "reordered" };
  }

  // ── Add Stop: POST /trips/:tripId/stops ──────────────────
  const addStopMatch = endpoint.match(/^\/trips\/([^/]+)\/stops$/);
  if (addStopMatch && method === "POST") {
    const tripId = addStopMatch[1];
    const trip = findTrip(tripId);
    if (!trip) throw { code: "NOT_FOUND", message: "Trip not found" };
    const newStop = {
      id: "stop-" + uid(),
      cityName: body.cityName, country: body.country || "",
      latitude: body.latitude || null, longitude: body.longitude || null,
      costIndex: body.costIndex || null, popularity: body.popularity || null,
      startDate: body.startDate, endDate: body.endDate,
      order: (trip.stops || []).length + 1,
      activities: [],
    };
    trip.stops = [...(trip.stops || []), newStop];
    trip.stopCount = trip.stops.length;
    return newStop;
  }

  // ── Single Stop: PUT/DELETE /stops/:id ────────────────────
  const stopMatch = endpoint.match(/^\/stops\/([^/]+)$/);
  if (stopMatch && method === "PUT") {
    const stopId = stopMatch[1];
    const trip = findTripByStop(stopId);
    if (!trip) throw { code: "NOT_FOUND", message: "Stop not found" };
    const idx = trip.stops.findIndex((s) => s.id === stopId);
    trip.stops[idx] = { ...trip.stops[idx], ...body };
    return trip.stops[idx];
  }
  if (stopMatch && method === "DELETE") {
    const stopId = stopMatch[1];
    const trip = findTripByStop(stopId);
    if (!trip) throw { code: "NOT_FOUND", message: "Stop not found" };
    trip.stops = trip.stops.filter((s) => s.id !== stopId);
    trip.stopCount = trip.stops.length;
    return { message: "stop deleted" };
  }

  // ── Activities Reorder: PUT /stops/:stopId/activities/reorder
  const actReorderMatch = endpoint.match(/^\/stops\/([^/]+)\/activities\/reorder$/);
  if (actReorderMatch && method === "PUT") {
    const stopId = actReorderMatch[1];
    const trip = findTripByStop(stopId);
    if (!trip) throw { code: "NOT_FOUND", message: "Stop not found" };
    const stop = trip.stops.find((s) => s.id === stopId);
    const { activityIds } = body;
    const reordered = activityIds.map((aid, i) => {
      const act = stop.activities.find((a) => a.id === aid);
      return act ? { ...act, order: i + 1 } : null;
    }).filter(Boolean);
    stop.activities = reordered;
    return { message: "reordered" };
  }

  // ── Add Activity: POST /stops/:stopId/activities ─────────
  const addActMatch = endpoint.match(/^\/stops\/([^/]+)\/activities$/);
  if (addActMatch && method === "POST") {
    const stopId = addActMatch[1];
    const trip = findTripByStop(stopId);
    if (!trip) throw { code: "NOT_FOUND", message: "Stop not found" };
    const stop = trip.stops.find((s) => s.id === stopId);
    const newAct = {
      id: "act-" + uid(),
      name: body.name, type: body.type || "sightseeing",
      category: body.category || "activity", cost: Number(body.cost) || 0,
      duration: Number(body.duration) || 0, description: body.description || "",
      imageUrl: body.imageUrl || "",
      order: (stop.activities || []).length + 1,
      scheduledAt: body.scheduledAt || stop.startDate,
    };
    stop.activities = [...(stop.activities || []), newAct];
    return newAct;
  }

  // ── Single Activity: PUT/DELETE /activities/:id ──────────
  const actMatch = endpoint.match(/^\/activities\/([^/]+)$/);
  if (actMatch && method === "PUT") {
    const actId = actMatch[1];
    for (const trip of MOCK_TRIPS) {
      for (const stop of trip.stops || []) {
        const idx = (stop.activities || []).findIndex((a) => a.id === actId);
        if (idx !== -1) {
          stop.activities[idx] = { ...stop.activities[idx], ...body };
          return stop.activities[idx];
        }
      }
    }
    throw { code: "NOT_FOUND", message: "Activity not found" };
  }
  if (actMatch && method === "DELETE") {
    const actId = actMatch[1];
    for (const trip of MOCK_TRIPS) {
      for (const stop of trip.stops || []) {
        const idx = (stop.activities || []).findIndex((a) => a.id === actId);
        if (idx !== -1) {
          stop.activities.splice(idx, 1);
          return { message: "activity deleted" };
        }
      }
    }
    throw { code: "NOT_FOUND", message: "Activity not found" };
  }

  // ── Single Trip: GET/PUT/DELETE /trips/:id ───────────────
  const tripMatch = endpoint.match(/^\/trips\/([^/]+)$/);

  // ── Copy Trip: POST /trips/:id/copy ──────────────────────
  const copyMatch = endpoint.match(/^\/trips\/([^/]+)\/copy$/);
  if (copyMatch && method === "POST") {
    const srcTrip = findTrip(copyMatch[1]);
    if (!srcTrip) throw { code: "NOT_FOUND", message: "Trip not found" };
    const now = new Date();
    const origStart = new Date(srcTrip.startDate);
    const diff = now.getTime() - origStart.getTime();
    const shiftDate = (d) => new Date(new Date(d).getTime() + diff).toISOString();
    const copiedTrip = {
      ...JSON.parse(JSON.stringify(srcTrip)),
      id: "trip-" + uid(), shareId: "share-" + uid(), userId: MOCK_USER.id,
      isPublic: false, createdAt: now.toISOString(),
      startDate: shiftDate(srcTrip.startDate), endDate: shiftDate(srcTrip.endDate),
      stops: (srcTrip.stops || []).map((s) => ({
        ...s, id: "stop-" + uid(),
        startDate: shiftDate(s.startDate), endDate: shiftDate(s.endDate),
        activities: (s.activities || []).map((a) => ({
          ...a, id: "act-" + uid(),
          scheduledAt: a.scheduledAt ? shiftDate(a.scheduledAt) : undefined,
        })),
      })),
    };
    copiedTrip.stopCount = copiedTrip.stops.length;
    MOCK_TRIPS.unshift(copiedTrip);
    return copiedTrip;
  }

  if (tripMatch && method === "GET") {
    const found = findTrip(tripMatch[1]);
    if (!found) throw { code: "NOT_FOUND", message: "Trip not found" };
    return found;
  }
  if (tripMatch && method === "PUT") {
    const idx = MOCK_TRIPS.findIndex((t) => t.id === tripMatch[1]);
    if (idx === -1) throw { code: "NOT_FOUND", message: "Trip not found" };
    MOCK_TRIPS[idx] = { ...MOCK_TRIPS[idx], ...body };
    return MOCK_TRIPS[idx];
  }
  if (tripMatch && method === "DELETE") {
    MOCK_TRIPS = MOCK_TRIPS.filter((t) => t.id !== tripMatch[1]);
    return { message: "trip deleted" };
  }

  // ── Budget: GET /trips/:tripId/budget ────────────────────
  const budgetMatch = endpoint.match(/^\/trips\/([^/]+)\/budget$/);
  if (budgetMatch && method === "GET") {
    const trip = findTrip(budgetMatch[1]);
    if (!trip) throw { code: "NOT_FOUND", message: "Trip not found" };
    return computeBudget(trip);
  }

  // Admin Stats endpoint
  if (endpoint === "/admin/stats" && method === "GET") {
    return {
      totalUsers: 48,
      totalTrips: 92,
      topCities: [
        { cityName: "Paris", count: 28 },
        { cityName: "Tokyo", count: 24 },
        { cityName: "Rome", count: 19 },
        { cityName: "Kyoto", count: 15 },
        { cityName: "Barcelona", count: 12 },
      ],
      topActivities: [
        { name: "Louvre Museum Tour", count: 22 },
        { name: "Seine Sunset Dinner Cruise", count: 18 },
        { name: "Colosseum Arena Walk", count: 16 },
        { name: "Sagrada Familia Exploration", count: 14 },
        { name: "Shibuya Crossing Food Tour", count: 11 },
      ],
      activeUsersLast7Days: 26,
    };
  }

  // ── Fallback ─────────────────────────────────────────────
  throw { code: "NOT_FOUND", message: `Mock route ${method} ${endpoint} not implemented` };
}
