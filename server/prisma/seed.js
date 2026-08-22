import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma.js";

async function main() {
  console.log("Seeding massive database with 5 users, 10 rich trips, and destinations...");

  // Clean existing demo data deterministically
  await prisma.activity.deleteMany({});
  await prisma.stop.deleteMany({});
  await prisma.trip.deleteMany({});
  await prisma.savedDestination.deleteMany({});
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          "demo@globetrotter.app",
          "admin@globetrotter.app",
          "ammar@globetrotter.app",
          "daksh@globetrotter.app",
          "vineet@globetrotter.app",
        ],
      },
    },
  });

  const hashedPassword = await bcrypt.hash("password123", 10);

  // ─────────────────────────────────────────────────────────────
  // 1. 5 USERS
  // ─────────────────────────────────────────────────────────────
  const demoUser = await prisma.user.create({
    data: {
      name: "Rishab Ravikumar",
      email: "demo@globetrotter.app",
      password: hashedPassword,
      language: "en",
      photoUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=300",
      isAdmin: false,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      name: "GlobeTrotter Admin",
      email: "admin@globetrotter.app",
      password: hashedPassword,
      language: "en",
      photoUrl: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=300",
      isAdmin: true,
    },
  });

  const ammarUser = await prisma.user.create({
    data: {
      name: "Ammar Meman",
      email: "ammar@globetrotter.app",
      password: hashedPassword,
      language: "en",
      photoUrl: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=300",
      isAdmin: false,
    },
  });

  const dakshUser = await prisma.user.create({
    data: {
      name: "Daksh Patel",
      email: "daksh@globetrotter.app",
      password: hashedPassword,
      language: "en",
      photoUrl: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=300",
      isAdmin: false,
    },
  });

  const vineetUser = await prisma.user.create({
    data: {
      name: "Vineet Sharma",
      email: "vineet@globetrotter.app",
      password: hashedPassword,
      language: "en",
      photoUrl: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=300",
      isAdmin: false,
    },
  });

  // ─────────────────────────────────────────────────────────────
  // 2. SAVED WISHLIST DESTINATIONS
  // ─────────────────────────────────────────────────────────────
  await prisma.savedDestination.createMany({
    data: [
      { cityName: "Goa", userId: demoUser.id },
      { cityName: "Udaipur", userId: demoUser.id },
      { cityName: "Manali", userId: demoUser.id },
      { cityName: "Kyoto", userId: demoUser.id },
      { cityName: "Paris", userId: ammarUser.id },
      { cityName: "Tokyo", userId: ammarUser.id },
      { cityName: "Singapore", userId: dakshUser.id },
      { cityName: "Dubai", userId: dakshUser.id },
      { cityName: "Darjeeling", userId: vineetUser.id },
      { cityName: "Jaipur", userId: vineetUser.id },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // 3. 10 TRIPS WITH COMPLETE STOPS & TIMELINE ACTIVITIES
  // ─────────────────────────────────────────────────────────────

  // ── TRIP 1 (Demo User) : Incredible India Heritage Tour ──
  await prisma.trip.create({
    data: {
      name: "Incredible India Heritage Tour",
      startDate: new Date("2026-09-01T00:00:00.000Z"),
      endDate: new Date("2026-09-10T00:00:00.000Z"),
      description: "A 10-day cultural journey across Jaipur, Agra, and Varanasi discovering royal palaces, monuments, and spiritual ghats.",
      coverPhoto: "https://images.pexels.com/photos/32261804/pexels-photo-32261804.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      isPublic: true,
      budgetLimit: 1500,
      userId: demoUser.id,
      stops: {
        create: [
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
                  imageUrl: "https://images.pexels.com/photos/32261804/pexels-photo-32261804.jpeg?auto=compress&cs=tinysrgb&w=600",
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
                  imageUrl: "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=600",
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
                  imageUrl: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=600",
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
                  imageUrl: "https://images.pexels.com/photos/2790396/pexels-photo-2790396.jpeg?auto=compress&cs=tinysrgb&w=600",
                  scheduledAt: new Date("2026-09-04T08:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
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
                  imageUrl: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=600",
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
                  imageUrl: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=600",
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
                  imageUrl: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600",
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
                  imageUrl: "https://images.pexels.com/photos/2790396/pexels-photo-2790396.jpeg?auto=compress&cs=tinysrgb&w=600",
                  scheduledAt: new Date("2026-09-07T07:30:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
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
                  imageUrl: "https://images.pexels.com/photos/19272041/pexels-photo-19272041.jpeg?auto=compress&cs=tinysrgb&w=600",
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
                  imageUrl: "https://images.pexels.com/photos/19272041/pexels-photo-19272041.jpeg?auto=compress&cs=tinysrgb&w=600",
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
                  imageUrl: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=600",
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

  // ── TRIP 2 (Demo User) : Goa & Kerala Coastal Retreat ──
  await prisma.trip.create({
    data: {
      name: "Goa & Kerala Coastal Retreat",
      startDate: new Date("2026-10-05T00:00:00.000Z"),
      endDate: new Date("2026-10-12T00:00:00.000Z"),
      description: "A 7-day tropical retreat exploring sunny beaches of Goa and serene backwaters of Alleppey, Kerala.",
      coverPhoto: "https://images.pexels.com/photos/4429334/pexels-photo-4429334.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      isPublic: true,
      budgetLimit: 1200,
      userId: demoUser.id,
      stops: {
        create: [
          {
            cityName: "Goa",
            country: "India",
            latitude: 15.2993,
            longitude: 74.124,
            costIndex: 60.0,
            popularity: 97,
            startDate: new Date("2026-10-05T00:00:00.000Z"),
            endDate: new Date("2026-10-08T00:00:00.000Z"),
            order: 0,
            activities: {
              create: [
                {
                  name: "Vagator Cliffside Boutique Resort",
                  type: "Beach Resort",
                  category: "stay",
                  cost: 220,
                  duration: 1440,
                  description: "Sea-facing boutique villa with sunset views.",
                  imageUrl: "https://images.pexels.com/photos/4429334/pexels-photo-4429334.jpeg?auto=compress&cs=tinysrgb&w=600",
                  scheduledAt: new Date("2026-10-05T14:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Calangute Parasailing & Jet Ski",
                  type: "Adventure",
                  category: "activity",
                  cost: 45,
                  duration: 180,
                  description: "Exciting parasailing and water sports combo.",
                  imageUrl: "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=600",
                  scheduledAt: new Date("2026-10-06T10:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Curlies Beach Shack Goan Fish Curry Dinner",
                  type: "Seafood Dining",
                  category: "meal",
                  cost: 30,
                  duration: 120,
                  description: "Fresh catch Goan prawn curry with coconut rice.",
                  imageUrl: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600",
                  scheduledAt: new Date("2026-10-07T19:30:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
          {
            cityName: "Kerala",
            country: "India",
            latitude: 9.4981,
            longitude: 76.3388,
            costIndex: 55.0,
            popularity: 94,
            startDate: new Date("2026-10-08T00:00:00.000Z"),
            endDate: new Date("2026-10-12T00:00:00.000Z"),
            order: 1,
            activities: {
              create: [
                {
                  name: "Alleppey Luxury Houseboat Cruise Stay",
                  type: "Houseboat",
                  category: "stay",
                  cost: 250,
                  duration: 1440,
                  description: "Private wooden houseboat cruising palm-fringed canals.",
                  imageUrl: "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=600",
                  scheduledAt: new Date("2026-10-08T13:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Backwaters Kayaking & Village Walk",
                  type: "Eco Tour",
                  category: "activity",
                  cost: 25,
                  duration: 210,
                  description: "Morning canoe paddle through narrow waterways.",
                  imageUrl: "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=600",
                  scheduledAt: new Date("2026-10-09T09:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Traditional Kerala Banana Leaf Sadhya",
                  type: "Authentic Meal",
                  category: "meal",
                  cost: 20,
                  duration: 90,
                  description: "24-dish vegetarian feast on plantain leaf.",
                  imageUrl: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=600",
                  scheduledAt: new Date("2026-10-10T12:30:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ── TRIP 3 (Demo User) : Himalayan Peaks & High Passes ──
  await prisma.trip.create({
    data: {
      name: "Himalayan Peaks & High Passes",
      startDate: new Date("2026-11-01T00:00:00.000Z"),
      endDate: new Date("2026-11-08T00:00:00.000Z"),
      description: "High altitude adventure across snow-capped peaks, alpine valleys, and ancient Buddhist monasteries.",
      coverPhoto: "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      isPublic: true,
      budgetLimit: 1800,
      userId: demoUser.id,
      stops: {
        create: [
          {
            cityName: "Manali",
            country: "India",
            latitude: 32.2432,
            longitude: 77.1892,
            costIndex: 50.0,
            popularity: 93,
            startDate: new Date("2026-11-01T00:00:00.000Z"),
            endDate: new Date("2026-11-04T00:00:00.000Z"),
            order: 0,
            activities: {
              create: [
                {
                  name: "Cedar Pine Himalayan Chalet",
                  type: "Mountain Resort",
                  category: "stay",
                  cost: 140,
                  duration: 1440,
                  description: "Wood and stone chalet with panoramic mountain views.",
                  imageUrl: "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=600",
                  scheduledAt: new Date("2026-11-01T15:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Solang Valley Paragliding",
                  type: "Adventure",
                  category: "activity",
                  cost: 50,
                  duration: 180,
                  description: "Tandem paragliding flight over Solang valley.",
                  imageUrl: "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=600",
                  scheduledAt: new Date("2026-11-02T11:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Old Manali Cafe Hopping",
                  type: "Cafe Dining",
                  category: "meal",
                  cost: 25,
                  duration: 120,
                  description: "Freshly caught Himalayan trout with herbal tea.",
                  imageUrl: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600",
                  scheduledAt: new Date("2026-11-03T19:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
          {
            cityName: "Ladakh",
            country: "India",
            latitude: 34.1526,
            longitude: 77.5771,
            costIndex: 65.0,
            popularity: 96,
            startDate: new Date("2026-11-04T00:00:00.000Z"),
            endDate: new Date("2026-11-08T00:00:00.000Z"),
            order: 1,
            activities: {
              create: [
                {
                  name: "Stok Heritage Boutique Hotel",
                  type: "Heritage Stay",
                  category: "stay",
                  cost: 190,
                  duration: 1440,
                  description: "Authentic Ladakhi architecture facing Stok Kangri.",
                  imageUrl: "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=600",
                  scheduledAt: new Date("2026-11-04T16:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Pangong Tso Lake 4x4 Safari",
                  type: "Sightseeing",
                  category: "activity",
                  cost: 60,
                  duration: 420,
                  description: "Scenic 4x4 drive across Chang La pass to Pangong Lake.",
                  imageUrl: "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=600",
                  scheduledAt: new Date("2026-11-05T08:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Tibetan Momos & Butter Tea",
                  type: "Local Cuisine",
                  category: "meal",
                  cost: 15,
                  duration: 90,
                  description: "Steaming hot handmade yak cheese and momos.",
                  imageUrl: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=600",
                  scheduledAt: new Date("2026-11-06T18:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ── TRIP 4 (Demo User) : Royal Rajasthan Forts & Lakes ──
  await prisma.trip.create({
    data: {
      name: "Royal Rajasthan Forts & Lakes",
      startDate: new Date("2026-12-01T00:00:00.000Z"),
      endDate: new Date("2026-12-07T00:00:00.000Z"),
      description: "Exploring the City of Lakes (Udaipur) and the Blue City (Jodhpur).",
      coverPhoto: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      isPublic: true,
      budgetLimit: 1400,
      userId: demoUser.id,
      stops: {
        create: [
          {
            cityName: "Udaipur",
            country: "India",
            latitude: 24.5854,
            longitude: 73.7125,
            costIndex: 60.0,
            popularity: 96,
            startDate: new Date("2026-12-01T00:00:00.000Z"),
            endDate: new Date("2026-12-04T00:00:00.000Z"),
            order: 0,
            activities: {
              create: [
                {
                  name: "Lake Pichola Heritage Palace",
                  type: "Palace Stay",
                  category: "stay",
                  cost: 210,
                  duration: 1440,
                  description: "Waterfront royal palace on Lake Pichola.",
                  imageUrl: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?w=600",
                  scheduledAt: new Date("2026-12-01T15:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "City Palace & Boat Ride",
                  type: "Sightseeing",
                  category: "activity",
                  cost: 30,
                  duration: 180,
                  description: "Grand marble City Palace and sunset boat ride.",
                  imageUrl: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?w=600",
                  scheduledAt: new Date("2026-12-02T10:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Rooftop Mewari Thali Dinner",
                  type: "Dining",
                  category: "meal",
                  cost: 35,
                  duration: 120,
                  description: "Authentic Mewari cuisine with illuminated lake views.",
                  imageUrl: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?w=600",
                  scheduledAt: new Date("2026-12-03T19:30:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
          {
            cityName: "Jodhpur",
            country: "India",
            latitude: 26.2389,
            longitude: 73.0243,
            costIndex: 52.0,
            popularity: 92,
            startDate: new Date("2026-12-04T00:00:00.000Z"),
            endDate: new Date("2026-12-07T00:00:00.000Z"),
            order: 1,
            activities: {
              create: [
                {
                  name: "Mehrangarh Fort Ziplining",
                  type: "Adventure",
                  category: "activity",
                  cost: 40,
                  duration: 150,
                  description: "Flying fox zip tour across the battlements of Mehrangarh.",
                  imageUrl: "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?w=600",
                  scheduledAt: new Date("2026-12-05T10:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Old Blue City Heritage Walk",
                  type: "Walking Tour",
                  category: "activity",
                  cost: 15,
                  duration: 120,
                  description: "Wandering through the indigo blue lanes and spice markets.",
                  imageUrl: "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?w=600",
                  scheduledAt: new Date("2026-12-06T16:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ── TRIP 5 (Demo User) : Kashmir Valley Heaven on Earth ──
  await prisma.trip.create({
    data: {
      name: "Kashmir Valley Heaven on Earth",
      startDate: new Date("2026-12-15T00:00:00.000Z"),
      endDate: new Date("2026-12-20T00:00:00.000Z"),
      description: "Winter wonderland journey across Dal Lake houseboats and snow slopes of Gulmarg.",
      coverPhoto: "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      isPublic: false,
      budgetLimit: 1600,
      userId: demoUser.id,
      stops: {
        create: [
          {
            cityName: "Srinagar",
            country: "India",
            latitude: 34.0837,
            longitude: 74.7973,
            costIndex: 58.0,
            popularity: 95,
            startDate: new Date("2026-12-15T00:00:00.000Z"),
            endDate: new Date("2026-12-18T00:00:00.000Z"),
            order: 0,
            activities: {
              create: [
                {
                  name: "Dal Lake Luxury Shikara Houseboat",
                  type: "Houseboat",
                  category: "stay",
                  cost: 180,
                  duration: 1440,
                  description: "Carved cedarwood houseboat on Dal Lake.",
                  imageUrl: "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?w=600",
                  scheduledAt: new Date("2026-12-15T15:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Morning Floating Flower Market Shikara Ride",
                  type: "Eco Tour",
                  category: "activity",
                  cost: 20,
                  duration: 120,
                  description: "Early dawn shikara paddle through the historic floating market.",
                  imageUrl: "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?w=600",
                  scheduledAt: new Date("2026-12-16T06:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Authentic Kashmiri Wazwan Banquet",
                  type: "Cultural Feast",
                  category: "meal",
                  cost: 40,
                  duration: 120,
                  description: "Rogan Josh, Gushtaba, and saffron Kahwa tea.",
                  imageUrl: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?w=600",
                  scheduledAt: new Date("2026-12-17T19:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
          {
            cityName: "Gulmarg",
            country: "India",
            latitude: 34.0484,
            longitude: 74.3805,
            costIndex: 65.0,
            popularity: 97,
            startDate: new Date("2026-12-18T00:00:00.000Z"),
            endDate: new Date("2026-12-20T00:00:00.000Z"),
            order: 1,
            activities: {
              create: [
                {
                  name: "Gulmarg Gondola Phase 2 Ski Ride",
                  type: "Snow Sport",
                  category: "activity",
                  cost: 50,
                  duration: 240,
                  description: "Highest cable car in Asia taking you to Mount Apharwat.",
                  imageUrl: "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?w=600",
                  scheduledAt: new Date("2026-12-19T10:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ── TRIP 6 (Ammar) : European Grand Highlights ──
  await prisma.trip.create({
    data: {
      name: "European Grand Highlights",
      startDate: new Date("2026-07-01T00:00:00.000Z"),
      endDate: new Date("2026-07-10T00:00:00.000Z"),
      description: "Paris, Rome, and Barcelona summer exploration.",
      coverPhoto: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      isPublic: true,
      budgetLimit: 2500,
      userId: ammarUser.id,
      stops: {
        create: [
          {
            cityName: "Paris",
            country: "France",
            latitude: 48.8566,
            longitude: 2.3522,
            costIndex: 82.0,
            popularity: 98,
            startDate: new Date("2026-07-01T00:00:00.000Z"),
            endDate: new Date("2026-07-04T00:00:00.000Z"),
            order: 0,
            activities: {
              create: [
                {
                  name: "Louvre Museum Tour",
                  type: "Sightseeing",
                  category: "activity",
                  cost: 35,
                  duration: 180,
                  description: "Guided tour through the world's largest art museum.",
                  imageUrl: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?w=600",
                  scheduledAt: new Date("2026-07-02T10:00:00.000Z"),
                  order: 0,
                },
                {
                  name: "Bistro Paul Bert Dinner",
                  type: "Dining",
                  category: "meal",
                  cost: 65,
                  duration: 120,
                  description: "Classic French dinner and wine pairing.",
                  imageUrl: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?w=600",
                  scheduledAt: new Date("2026-07-03T19:30:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
          {
            cityName: "Rome",
            country: "Italy",
            latitude: 41.9028,
            longitude: 12.4964,
            costIndex: 75.0,
            popularity: 96,
            startDate: new Date("2026-07-04T00:00:00.000Z"),
            endDate: new Date("2026-07-07T00:00:00.000Z"),
            order: 1,
            activities: {
              create: [
                {
                  name: "Colosseum & Roman Forum Tour",
                  type: "Historical Landmark",
                  category: "activity",
                  cost: 40,
                  duration: 210,
                  description: "Ancient arena and gladiator quarters.",
                  imageUrl: "https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?w=600",
                  scheduledAt: new Date("2026-07-05T09:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ── TRIP 7 (Ammar) : Japan Sakura & Cyberpunk Odyssey ──
  await prisma.trip.create({
    data: {
      name: "Japan Sakura & Cyberpunk Odyssey",
      startDate: new Date("2026-08-01T00:00:00.000Z"),
      endDate: new Date("2026-08-08T00:00:00.000Z"),
      description: "Neon skyscrapers of Tokyo and timeless Zen gardens of Kyoto.",
      coverPhoto: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      isPublic: true,
      budgetLimit: 2200,
      userId: ammarUser.id,
      stops: {
        create: [
          {
            cityName: "Tokyo",
            country: "Japan",
            latitude: 35.6762,
            longitude: 139.6503,
            costIndex: 85.0,
            popularity: 99,
            startDate: new Date("2026-08-01T00:00:00.000Z"),
            endDate: new Date("2026-08-04T00:00:00.000Z"),
            order: 0,
            activities: {
              create: [
                {
                  name: "Shibuya Sky Observation Deck",
                  type: "Sightseeing",
                  category: "activity",
                  cost: 20,
                  duration: 90,
                  description: "360-degree panoramic glass deck overlooking Shibuya crossing.",
                  imageUrl: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?w=600",
                  scheduledAt: new Date("2026-08-02T17:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
          {
            cityName: "Kyoto",
            country: "Japan",
            latitude: 35.0116,
            longitude: 135.7681,
            costIndex: 78.0,
            popularity: 97,
            startDate: new Date("2026-08-04T00:00:00.000Z"),
            endDate: new Date("2026-08-08T00:00:00.000Z"),
            order: 1,
            activities: {
              create: [
                {
                  name: "Fushimi Inari Torii Gate Walk",
                  type: "Sightseeing",
                  category: "activity",
                  cost: 0,
                  duration: 180,
                  description: "Thousands of vermillion torii gates winding up sacred mountain.",
                  imageUrl: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?w=600",
                  scheduledAt: new Date("2026-08-05T07:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ── TRIP 8 (Daksh) : South East Asia Wonders ──
  await prisma.trip.create({
    data: {
      name: "South East Asia Wonders",
      startDate: new Date("2026-09-15T00:00:00.000Z"),
      endDate: new Date("2026-09-22T00:00:00.000Z"),
      description: "Street food markets in Bangkok and futuristic Gardens by the Bay in Singapore.",
      coverPhoto: "https://images.pexels.com/photos/5273081/pexels-photo-5273081.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      isPublic: true,
      budgetLimit: 1600,
      userId: dakshUser.id,
      stops: {
        create: [
          {
            cityName: "Bangkok",
            country: "Thailand",
            latitude: 13.7563,
            longitude: 100.5018,
            costIndex: 45.0,
            popularity: 98,
            startDate: new Date("2026-09-15T00:00:00.000Z"),
            endDate: new Date("2026-09-18T00:00:00.000Z"),
            order: 0,
            activities: {
              create: [
                {
                  name: "Wat Pho & Grand Palace",
                  type: "Sightseeing",
                  category: "activity",
                  cost: 20,
                  duration: 180,
                  description: "Giant reclining Buddha and gold stupas.",
                  imageUrl: "https://images.pexels.com/photos/5273081/pexels-photo-5273081.jpeg?w=600",
                  scheduledAt: new Date("2026-09-16T09:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
          {
            cityName: "Singapore",
            country: "Singapore",
            latitude: 1.3521,
            longitude: 103.8198,
            costIndex: 88.0,
            popularity: 99,
            startDate: new Date("2026-09-18T00:00:00.000Z"),
            endDate: new Date("2026-09-22T00:00:00.000Z"),
            order: 1,
            activities: {
              create: [
                {
                  name: "Gardens by the Bay Light Show",
                  type: "Sightseeing",
                  category: "activity",
                  cost: 25,
                  duration: 120,
                  description: "Supertrees and Cloud Forest biodome.",
                  imageUrl: "https://images.pexels.com/photos/5273081/pexels-photo-5273081.jpeg?w=600",
                  scheduledAt: new Date("2026-09-19T19:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ── TRIP 9 (Daksh) : Dubai Glamour & Desert Safari ──
  await prisma.trip.create({
    data: {
      name: "Dubai Glamour & Desert Safari",
      startDate: new Date("2026-10-10T00:00:00.000Z"),
      endDate: new Date("2026-10-15T00:00:00.000Z"),
      description: "Burj Khalifa observations, desert dune bashing, and luxury yacht cruises.",
      coverPhoto: "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      isPublic: true,
      budgetLimit: 2000,
      userId: dakshUser.id,
      stops: {
        create: [
          {
            cityName: "Dubai",
            country: "United Arab Emirates",
            latitude: 25.2048,
            longitude: 55.2708,
            costIndex: 85.0,
            popularity: 98,
            startDate: new Date("2026-10-10T00:00:00.000Z"),
            endDate: new Date("2026-10-15T00:00:00.000Z"),
            order: 0,
            activities: {
              create: [
                {
                  name: "Desert 4x4 Dune Bashing & BBQ",
                  type: "Adventure",
                  category: "activity",
                  cost: 65,
                  duration: 360,
                  description: "Sunset sand dunes, camel ride, and traditional Tanoura show.",
                  imageUrl: "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?w=600",
                  scheduledAt: new Date("2026-10-11T15:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ── TRIP 10 (Vineet) : North East India Tea Valleys & Monasteries ──
  await prisma.trip.create({
    data: {
      name: "North East Tea Valleys & Monasteries",
      startDate: new Date("2026-11-10T00:00:00.000Z"),
      endDate: new Date("2026-11-16T00:00:00.000Z"),
      description: "Scenic Toy Train rides in Darjeeling and Buddhist stupas in Gangtok.",
      coverPhoto: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      isPublic: true,
      budgetLimit: 1100,
      userId: vineetUser.id,
      stops: {
        create: [
          {
            cityName: "Darjeeling",
            country: "India",
            latitude: 27.041,
            longitude: 88.2663,
            costIndex: 45.0,
            popularity: 93,
            startDate: new Date("2026-11-10T00:00:00.000Z"),
            endDate: new Date("2026-11-13T00:00:00.000Z"),
            order: 0,
            activities: {
              create: [
                {
                  name: "Tiger Hill Sunrise over Kanchenjunga",
                  type: "Sightseeing",
                  category: "activity",
                  cost: 15,
                  duration: 180,
                  description: "Golden sunrise illumination over the world's 3rd highest peak.",
                  imageUrl: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?w=600",
                  scheduledAt: new Date("2026-11-11T05:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
          {
            cityName: "Gangtok",
            country: "India",
            latitude: 27.3389,
            longitude: 88.6065,
            costIndex: 48.0,
            popularity: 94,
            startDate: new Date("2026-11-13T00:00:00.000Z"),
            endDate: new Date("2026-11-16T00:00:00.000Z"),
            order: 1,
            activities: {
              create: [
                {
                  name: "Rumtek Monastery Tibetan Chants",
                  type: "Spiritual",
                  category: "activity",
                  cost: 10,
                  duration: 120,
                  description: "Historic seat of the Karma Kagyu lineage with golden stupas.",
                  imageUrl: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?w=600",
                  scheduledAt: new Date("2026-11-14T10:00:00.000Z"),
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully with 5 users, 10 rich trips, and full itineraries!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
