import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma.js";

async function main() {
  console.log("Seeding database with Indian destinations...");

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
      name: "Rishab Ravikumar",
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

  // 3. Fully Populated Trip on Demo User (Golden Triangle & Spiritual India: Jaipur -> Agra -> Varanasi)
  const tripStartDate = new Date("2026-09-01T00:00:00.000Z");
  const tripEndDate = new Date("2026-09-10T00:00:00.000Z");

  const trip = await prisma.trip.create({
    data: {
      name: "Incredible India Heritage Tour",
      startDate: tripStartDate,
      endDate: tripEndDate,
      description: "A 10-day cultural journey across Jaipur, Agra, and Varanasi discovering royal palaces, monuments, and spiritual ghats.",
      coverPhoto: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
      isPublic: true,
      budgetLimit: 1500,
      userId: demoUser.id,
      stops: {
        create: [
          // Stop 1: Jaipur, Rajasthan (Sept 1 - Sept 4)
          {
            cityName: "Jaipur",
            country: "India",
            latitude: 26.9124,
            longitude: 75.7873,
            costIndex: 55.0,
            popularity: 96,
            startDate: new Date("2026-09-01T00:00:00.000Z"),
            endDate: new Date("2026-09-04T00:00:00.000Z"),
            order: 0,
            activities: {
              create: [
                {
                  name: "Heritage Haveli Palace Stay",
                  type: "Heritage Hotel",
                  category: "stay",
                  cost: 180,
                  duration: 1440,
                  description: "Traditional Rajasthani palace stay with courtyards and folk music.",
                  imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-01T14:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Amber Fort & Hawa Mahal Tour",
                  type: "Sightseeing",
                  category: "activity",
                  cost: 25,
                  duration: 240,
                  description: "Guided architectural tour of Amber Palace and the Palace of Winds.",
                  imageUrl: "https://images.unsplash.com/photo-1603288967390-33d32e9a657f?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-02T09:30:00.000Z"),
                  order: 0,
                },
                {
                  name: "Chokhi Dhani Traditional Rajasthani Dinner",
                  type: "Cultural Dining",
                  category: "meal",
                  cost: 35,
                  duration: 180,
                  description: "Authentic Dal Baati Churma feast with traditional puppet show and dance.",
                  imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-03T19:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Vande Bharat Express: Jaipur to Agra",
                  type: "Train",
                  category: "transport",
                  cost: 30,
                  duration: 240,
                  description: "Comfortable high-speed air-conditioned train from Jaipur to Agra Cantt.",
                  imageUrl: "https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-04T08:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
          // Stop 2: Agra, Uttar Pradesh (Sept 4 - Sept 7)
          {
            cityName: "Agra",
            country: "India",
            latitude: 27.1767,
            longitude: 78.0081,
            costIndex: 50.0,
            popularity: 98,
            startDate: new Date("2026-09-04T00:00:00.000Z"),
            endDate: new Date("2026-09-07T00:00:00.000Z"),
            order: 1,
            activities: {
              create: [
                {
                  name: "Mughal Heritage View Resort",
                  type: "Resort Hotel",
                  category: "stay",
                  cost: 160,
                  duration: 1440,
                  description: "Comfortable stay with rooftop views overlooking the Taj Mahal.",
                  imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-04T15:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Sunrise Taj Mahal & Agra Fort Guided Walk",
                  type: "Historical Landmark",
                  category: "activity",
                  cost: 30,
                  duration: 240,
                  description: "Early morning priority access to the world wonder at golden hour.",
                  imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-05T06:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Agra Chaat & Mughlai Culinary Tasting",
                  type: "Food Tour",
                  category: "meal",
                  cost: 20,
                  duration: 120,
                  description: "Tasting famous Agra Petha, Bedmi Puri, and Mughlai kebabs.",
                  imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-06T18:30:00.000Z"),
                  order: 0,
                },
                {
                  name: "Vande Bharat Express: Agra to Varanasi",
                  type: "Train",
                  category: "transport",
                  cost: 40,
                  duration: 360,
                  description: "Direct premium train to the holy city of Varanasi.",
                  imageUrl: "https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-07T07:30:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
          // Stop 3: Varanasi, Uttar Pradesh (Sept 7 - Sept 10)
          {
            cityName: "Varanasi",
            country: "India",
            latitude: 25.3176,
            longitude: 82.9739,
            costIndex: 45.0,
            popularity: 95,
            startDate: new Date("2026-09-07T00:00:00.000Z"),
            endDate: new Date("2026-09-10T00:00:00.000Z"),
            order: 2,
            activities: {
              create: [
                {
                  name: "Ganges Riverside Heritage Hotel",
                  type: "Heritage Stay",
                  category: "stay",
                  cost: 150,
                  duration: 1440,
                  description: "Historic haveli on Dashashwamedh Ghat with direct river views.",
                  imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-07T16:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Evening Ganga Aarti Boat Experience",
                  type: "Spiritual Ceremony",
                  category: "activity",
                  cost: 20,
                  duration: 150,
                  description: "Private wooden boat viewing of the grand evening Aarti ceremony at Dashashwamedh Ghat.",
                  imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-08T18:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Old City Banarasi Kachori & Blue Lassi Breakfast",
                  type: "Local Food",
                  category: "meal",
                  cost: 15,
                  duration: 90,
                  description: "Freshly made hot kachoris followed by artisanal Varanasi saffron lassi.",
                  imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
                  scheduledAt: new Date("2026-09-09T08:30:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully with Indian destinations! Trip:", trip.name);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
