const MOCK_ACTIVITIES_BY_CITY = {
  paris: [
    {
      name: "Louvre Museum",
      type: "sightseeing",
      estimatedCost: 25,
      description: "World's largest art museum and historic monument in Paris.",
      imageUrl: "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=600",
    },
    {
      name: "Eiffel Tower Summit Access",
      type: "sightseeing",
      estimatedCost: 35,
      description: "Panoramic views of Paris from the iconic landmark.",
      imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600",
    },
    {
      name: "Seine River Dinner Cruise",
      type: "food",
      estimatedCost: 85,
      description: "Gourmet French dinner while cruising along the illuminated Seine.",
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
    },
    {
      name: "Montmartre Walking Tour",
      type: "sightseeing",
      estimatedCost: 15,
      description: "Explore the bohemian hill with Sacre-Coeur and artists square.",
      imageUrl: "https://images.unsplash.com/photo-1509299349698-dd22323b5963?w=600",
    },
  ],
  tokyo: [
    {
      name: "Senso-ji Temple Exploration",
      type: "sightseeing",
      estimatedCost: 0,
      description: "Tokyo's oldest and most significant ancient Buddhist temple.",
      imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600",
    },
    {
      name: "Shibuya Crossing & Hachiko Statue",
      type: "sightseeing",
      estimatedCost: 0,
      description: "Experience the world-famous scramble crossing in bustling Shibuya.",
      imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600",
    },
    {
      name: "Tsukiji Outer Market Food Tour",
      type: "food",
      estimatedCost: 45,
      description: "Sample fresh sashimi, tamagoyaki, and Japanese street food delicacies.",
      imageUrl: "https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?w=600",
    },
    {
      name: "teamLab Planets Digital Art",
      type: "adventure",
      estimatedCost: 38,
      description: "Immersive body-interactive digital art museum.",
      imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600",
    },
  ],
  rome: [
    {
      name: "Colosseum & Roman Forum Tour",
      type: "sightseeing",
      estimatedCost: 28,
      description: "Walk in the footsteps of gladiators in ancient Rome.",
      imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600",
    },
    {
      name: "Vatican Museums & Sistine Chapel",
      type: "sightseeing",
      estimatedCost: 32,
      description: "Marvel at Michelangelo's ceiling fresco and Renaissance masterpieces.",
      imageUrl: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600",
    },
    {
      name: "Trastevere Food & Wine Walking Tour",
      type: "food",
      estimatedCost: 55,
      description: "Authentic Roman pasta, supplì, gelato, and regional Italian wines.",
      imageUrl: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600",
    },
  ],
  barcelona: [
    {
      name: "Sagrada Familia Guided Visit",
      type: "sightseeing",
      estimatedCost: 30,
      description: "Gaudí's unfinished architectural marvel and UNESCO World Heritage site.",
      imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600",
    },
    {
      name: "Park Güell Monumental Zone",
      type: "sightseeing",
      estimatedCost: 15,
      description: "Colorful mosaic park overlooking the city of Barcelona.",
      imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600",
    },
    {
      name: "Tapas & Flamenco Show",
      type: "food",
      estimatedCost: 60,
      description: "Live flamenco performance paired with traditional Catalan tapas.",
      imageUrl: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=600",
    },
  ],
  london: [
    {
      name: "Tower of London & Crown Jewels",
      type: "sightseeing",
      estimatedCost: 35,
      description: "Historic royal fortress and home to the glittering Crown Jewels.",
      imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600",
    },
    {
      name: "British Museum Highlights",
      type: "sightseeing",
      estimatedCost: 0,
      description: "World-class collection spanning 2 million years of human history.",
      imageUrl: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600",
    },
  ],
  "new york": [
    {
      name: "Empire State Building Observatory",
      type: "sightseeing",
      estimatedCost: 44,
      description: "Iconic art deco skyscraper with 360-degree views of Manhattan.",
      imageUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600",
    },
    {
      name: "Central Park Bike Rental Tour",
      type: "adventure",
      estimatedCost: 25,
      description: "Cycle through Bow Bridge, Strawberry Fields, and Bethesda Terrace.",
      imageUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600",
    },
  ],
};

const DEFAULT_ACTIVITIES = [
  {
    name: "Historic Old Town Walking Tour",
    type: "sightseeing",
    estimatedCost: 15,
    description: "Guided cultural walk through the historic center and notable landmarks.",
    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600",
  },
  {
    name: "Local Food Market Tasting Tour",
    type: "food",
    estimatedCost: 40,
    description: "Sample delicious regional cuisine, fresh street food, and local specialties.",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
  },
  {
    name: "City Art & History Museum",
    type: "sightseeing",
    estimatedCost: 20,
    description: "Discover regional history, cultural treasures, and masterworks.",
    imageUrl: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=600",
  },
  {
    name: "Scenic Riverfront or Harbor Cruise",
    type: "adventure",
    estimatedCost: 30,
    description: "Relaxing sightseeing boat tour offering scenic skyline viewpoints.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
  },
];

/**
 * Searches suggested activities using mock / stub data.
 * @param {{ city?: string, type?: string, maxCost?: number }} params
 * @returns {Promise<Array<{name: string, type: string, estimatedCost: number, description: string, imageUrl: string}>>}
 */
export const searchActivities = async ({ city, type, maxCost }) => {
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
    const costLimit = Number(maxCost);
    list = list.filter((a) => a.estimatedCost <= costLimit);
  }

  return list;
};
