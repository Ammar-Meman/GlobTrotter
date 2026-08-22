let MOCK_USER = {
  id: "user-123",
  name: "Daksh Sharma",
  email: "daksh@globetrotter.app",
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  language: "en",
  isAdmin: false,
};

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
            id: "act-1",
            name: "Louvre Museum Guided Tour",
            type: "sightseeing",
            category: "activity",
            cost: 35,
            duration: 180,
            description: "Explore the Mona Lisa and classical sculptures with an art historian.",
            imageUrl: "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=600&auto=format&fit=crop&q=80",
            order: 1
          },
          {
            id: "act-2",
            name: "Seine Sunset Dinner Cruise",
            type: "food",
            category: "meal",
            cost: 85,
            duration: 120,
            description: "3-course French dining cruise overlooking the illuminated Eiffel Tower.",
            imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80",
            order: 2
          }
        ]
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
            id: "act-3",
            name: "Colosseum & Roman Forum",
            type: "sightseeing",
            category: "activity",
            cost: 28,
            duration: 150,
            description: "Gladiator arena underground access and ancient ruins walk.",
            imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80",
            order: 1
          }
        ]
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
            id: "act-4",
            name: "Sagrada Familia Audio Guided Tour",
            type: "architecture",
            category: "activity",
            cost: 30,
            duration: 90,
            description: "Gaudí masterpiece basilica with tower views.",
            imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&auto=format&fit=crop&q=80",
            order: 1
          }
        ]
      }
    ]
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
        activities: []
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
        activities: []
      }
    ]
  }
];

export async function mockApi(endpoint, options = {}) {
  // Simulate natural network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const method = options.method || "GET";

  // Auth Routes
  if (endpoint === "/auth/login" && method === "POST") {
    return { token: "mock-jwt-token-globetrotter-123", user: MOCK_USER };
  }
  if (endpoint === "/auth/signup" && method === "POST") {
    const body = options.body ? (typeof options.body === "string" ? JSON.parse(options.body) : options.body) : {};
    MOCK_USER = { ...MOCK_USER, name: body.name || MOCK_USER.name, email: body.email || MOCK_USER.email };
    return { token: "mock-jwt-token-globetrotter-123", user: MOCK_USER };
  }
  if (endpoint === "/auth/forgot-password" && method === "POST") {
    return { message: "reset link sent" };
  }
  if (endpoint === "/auth/me" && method === "GET") {
    if (!localStorage.getItem("token")) {
      throw { code: "UNAUTHORIZED", message: "Missing authorization token" };
    }
    return MOCK_USER;
  }

  // Upload Route (Cloudinary Mock)
  if (endpoint === "/uploads" && method === "POST") {
    return { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80" };
  }

  // User Profile Routes
  if (endpoint === "/users/me" && method === "PUT") {
    const body = options.body ? (typeof options.body === "string" ? JSON.parse(options.body) : options.body) : {};
    MOCK_USER = { ...MOCK_USER, ...body };
    return MOCK_USER;
  }

  // Trips Routes
  if (endpoint === "/trips" && method === "GET") {
    return MOCK_TRIPS.map((t) => ({
      id: t.id,
      name: t.name,
      startDate: t.startDate,
      endDate: t.endDate,
      description: t.description,
      coverPhoto: t.coverPhoto,
      budgetLimit: t.budgetLimit,
      stopCount: t.stops ? t.stops.length : (t.stopCount || 0),
      createdAt: t.createdAt,
    }));
  }

  if (endpoint === "/trips" && method === "POST") {
    let body = {};
    if (options.body) {
      body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
    }
    const newTrip = {
      id: "trip-" + Date.now(),
      name: body.name || "Untitled Journey",
      startDate: body.startDate || new Date().toISOString(),
      endDate: body.endDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      description: body.description || "",
      coverPhoto: body.coverPhoto || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80",
      budgetLimit: body.budgetLimit ? Number(body.budgetLimit) : null,
      shareId: "share-" + Date.now(),
      isPublic: false,
      userId: MOCK_USER.id,
      createdAt: new Date().toISOString(),
      stops: [],
      stopCount: 0,
    };
    MOCK_TRIPS.unshift(newTrip);
    return newTrip;
  }

  // Single Trip by ID: /trips/:id
  const tripMatch = endpoint.match(/^\/trips\/([^/]+)$/);
  if (tripMatch && method === "GET") {
    const id = tripMatch[1];
    const found = MOCK_TRIPS.find((t) => t.id === id);
    if (!found) throw { code: "NOT_FOUND", message: "Trip not found" };
    return found;
  }

  if (tripMatch && method === "PUT") {
    const id = tripMatch[1];
    const body = options.body ? (typeof options.body === "string" ? JSON.parse(options.body) : options.body) : {};
    const index = MOCK_TRIPS.findIndex((t) => t.id === id);
    if (index === -1) throw { code: "NOT_FOUND", message: "Trip not found" };
    MOCK_TRIPS[index] = { ...MOCK_TRIPS[index], ...body };
    return MOCK_TRIPS[index];
  }

  if (tripMatch && method === "DELETE") {
    const id = tripMatch[1];
    MOCK_TRIPS = MOCK_TRIPS.filter((t) => t.id !== id);
    return { message: "trip deleted" };
  }

  // Budget endpoint
  const budgetMatch = endpoint.match(/^\/trips\/([^/]+)\/budget$/);
  if (budgetMatch && method === "GET") {
    return {
      totalCost: 1450.50,
      byCategory: { transport: 400, stay: 600, activity: 250.50, meal: 200 },
      byDay: [
        { date: "2026-06-01T00:00:00.000Z", cost: 120, overBudget: false },
        { date: "2026-06-02T00:00:00.000Z", cost: 310, overBudget: true }
      ],
      averagePerDay: 96.7,
      dailyBudgetThreshold: 150
    };
  }

  // Fallback
  throw { code: "NOT_FOUND", message: `Mock route ${method} ${endpoint} not implemented` };
}
