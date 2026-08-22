const MOCK_USER = {
  id: "user-123",
  name: "Demo User",
  email: "demo@globetrotter.app",
  photoUrl: null,
  language: "en",
  isAdmin: false,
};

const MOCK_TRIPS = [
  {
    id: "trip-1",
    name: "Europe Summer",
    startDate: "2026-06-01T00:00:00.000Z",
    endDate: "2026-06-15T00:00:00.000Z",
    description: "Backpacking trip across Europe",
    coverPhoto: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
    stopCount: 3,
    createdAt: new Date().toISOString(),
  }
];

export async function mockApi(endpoint, options) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const method = options.method || "GET";
  
  // Auth Routes
  if (endpoint === "/auth/login" && method === "POST") {
    return { token: "mock-jwt-token-123", user: MOCK_USER };
  }
  if (endpoint === "/auth/signup" && method === "POST") {
    return { token: "mock-jwt-token-123", user: MOCK_USER };
  }
  if (endpoint === "/auth/forgot-password" && method === "POST") {
    return { message: "reset link sent" };
  }
  if (endpoint === "/auth/me" && method === "GET") {
    if (!localStorage.getItem("token")) {
      throw { code: "UNAUTHORIZED", message: "Missing token" };
    }
    return MOCK_USER;
  }

  // Trips Routes (Basic for now, will expand later if needed)
  if (endpoint === "/trips" && method === "GET") {
    return MOCK_TRIPS;
  }
  if (endpoint === "/trips" && method === "POST") {
    return {
      ...MOCK_TRIPS[0],
      id: "trip-new-" + Date.now(),
      name: JSON.parse(options.body).name,
    };
  }

  throw { code: "NOT_FOUND", message: `Mock route ${method} ${endpoint} not implemented` };
}
