import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma.js";

async function main() {
  console.log("Seeding database...");

  // Clean existing demo data deterministically
  await prisma.activity.deleteMany({});
  await prisma.stop.deleteMany({});
  await prisma.trip.deleteMany({});
  await prisma.savedDestination.deleteMany({});
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ["demo@globetrotter.app", "admin@globetrotter.app"],
      },
    },
  });

  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Demo User
  const demoUser = await prisma.user.create({
    data: {
      name: "Demo Traveler",
      email: "demo@globetrotter.app",
      password: hashedPassword,
      language: "en",
      isAdmin: false,
    },
  });

  // 2. Admin User
  await prisma.user.create({
    data: {
      name: "GlobeTrotter Admin",
      email: "admin@globetrotter.app",
      password: hashedPassword,
      language: "en",
      isAdmin: true,
    },
  });

  // 3. Fully Populated Trip on Demo User
  const tripStartDate = new Date("2026-09-01T00:00:00.000Z");
  const tripEndDate = new Date("2026-09-10T00:00:00.000Z");

  const trip = await prisma.trip.create({
    data: {
      name: "Grand European Tour",
      startDate: tripStartDate,
      endDate: tripEndDate,
      description: "A 10-day cultural, culinary, and architectural adventure across Paris, Rome, and Barcelona.",
      coverPhoto: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80",
      isPublic: true,
      budgetLimit: 2500,
      userId: demoUser.id,
      stops: {
        create: [
          // Stop 1: Paris (Days 1-3: Sept 1 - Sept 4)
          {
            cityName: "Paris",
            country: "France",
            latitude: 48.8566,
            longitude: 2.3522,
            costIndex: 82.5,
            popularity: 98,
            startDate: new Date("2026-09-01T00:00:00.000Z"),
            endDate: new Date("2026-09-04T00:00:00.000Z"),
            order: 0,
            activities: {
              create: [
                {
                  name: "Paris City Center Hotel",
                  type: "hotel",
                  category: "stay",
                  cost: 320,
                  duration: 1440,
                  description: "Charming boutique hotel near the Seine.",
                  imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-01T14:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Louvre Museum Guided Tour",
                  type: "sightseeing",
                  category: "activity",
                  cost: 35,
                  duration: 180,
                  description: "Guided tour through the world's largest art museum.",
                  imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-02T10:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Bistro Paul Bert Dinner",
                  type: "dining",
                  category: "meal",
                  cost: 75,
                  duration: 120,
                  description: "Classic French dinner and wine pairing.",
                  imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-03T19:30:00.000Z"),
                  order: 0,
                },
                {
                  name: "TGV Train Paris to Rome",
                  type: "transit",
                  category: "transport",
                  cost: 140,
                  duration: 480,
                  description: "High-speed rail journey through the Alps.",
                  imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-04T08:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
          // Stop 2: Rome (Days 4-7: Sept 4 - Sept 7)
          {
            cityName: "Rome",
            country: "Italy",
            latitude: 41.9028,
            longitude: 12.4964,
            costIndex: 75.0,
            popularity: 95,
            startDate: new Date("2026-09-04T00:00:00.000Z"),
            endDate: new Date("2026-09-07T00:00:00.000Z"),
            order: 1,
            activities: {
              create: [
                {
                  name: "Trastevere Historic Apartment",
                  type: "apartment",
                  category: "stay",
                  cost: 280,
                  duration: 1440,
                  description: "Cozy stay in the heart of Rome's vibrant Trastevere district.",
                  imageUrl: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-04T15:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Colosseum & Roman Forum Priority Access",
                  type: "sightseeing",
                  category: "activity",
                  cost: 45,
                  duration: 210,
                  description: "Explore the ancient amphitheater and the ruins of the Roman Empire.",
                  imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-05T09:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Pasta Making Workshop in Trastevere",
                  type: "workshop",
                  category: "activity",
                  cost: 65,
                  duration: 180,
                  description: "Hands-on authentic fettuccine and tiramisu cooking class.",
                  imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-06T17:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Flight Rome to Barcelona",
                  type: "flight",
                  category: "transport",
                  cost: 110,
                  duration: 120,
                  description: "Direct flight to Barcelona El Prat.",
                  imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-07T11:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
          // Stop 3: Barcelona (Days 7-10: Sept 7 - Sept 10)
          {
            cityName: "Barcelona",
            country: "Spain",
            latitude: 41.3879,
            longitude: 2.1699,
            costIndex: 68.0,
            popularity: 94,
            startDate: new Date("2026-09-07T00:00:00.000Z"),
            endDate: new Date("2026-09-10T00:00:00.000Z"),
            order: 2,
            activities: {
              create: [
                {
                  name: "Eixample Modernist Hotel",
                  type: "hotel",
                  category: "stay",
                  cost: 290,
                  duration: 1440,
                  description: "Modern hotel just walking distance to Casa Batlló and Sagrada Familia.",
                  imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-07T14:30:00.000Z"),
                  order: 0,
                },
                {
                  name: "Sagrada Familia Towers & Fast Track",
                  type: "sightseeing",
                  category: "activity",
                  cost: 40,
                  duration: 150,
                  description: "Audio-guided visit of Antoni Gaudi's breathtaking basilica with tower views.",
                  imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-08T10:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Gothic Quarter Tapas & Wine Tour",
                  type: "culinary",
                  category: "meal",
                  cost: 60,
                  duration: 180,
                  description: "Walking culinary tasting tour through Barcelona's oldest taverns.",
                  imageUrl: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-09T19:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully with Demo User, Admin User, and sample Trip:", trip.name);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
