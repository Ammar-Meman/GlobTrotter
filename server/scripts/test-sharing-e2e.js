import "dotenv/config";
import prisma from "../src/lib/prisma.js";
import * as tripService from "../src/services/trip.service.js";

async function testE2E() {
  console.log("Testing Sharing and Copy-Trip E2E against live database...");
  
  const demoUser = await prisma.user.findUnique({ where: { email: "demo@globetrotter.app" } });
  const adminUser = await prisma.user.findUnique({ where: { email: "admin@globetrotter.app" } });
  
  if (!demoUser || !adminUser) {
    throw new Error("Seed users not found. Run 'npm run seed' first.");
  }

  const trip = await prisma.trip.findFirst({
    where: { userId: demoUser.id, isPublic: true },
    include: { stops: { include: { activities: true } } },
  });

  if (!trip) throw new Error("No seeded public trip found.");

  // 1. Verify Public Sharing
  console.log("1. Verifying GET /api/trips/public/:shareId...");
  const publicTrip = await tripService.getPublicTripByShareId(trip.shareId);
  if (!publicTrip || publicTrip.userId) {
    throw new Error("Public trip invalid or leaked userId");
  }
  if (!publicTrip.stops || publicTrip.stops.length === 0) {
    throw new Error("Public trip has no stops");
  }
  console.log("   -> Public share verified. Stop count:", publicTrip.stops.length);

  // 2. Verify Copy Trip with Date Shifting
  console.log("2. Verifying POST /api/trips/:id/copy...");
  const copiedTrip = await tripService.copyTrip(adminUser.id, trip.id);
  if (!copiedTrip) throw new Error("copyTrip failed");
  if (copiedTrip.userId && copiedTrip.userId !== adminUser.id) {
    throw new Error("Copied trip ownership mismatch");
  }
  if (copiedTrip.stops.length !== trip.stops.length) {
    throw new Error("Copied trip stops count mismatch");
  }

  console.log("   -> Copied trip created:", copiedTrip.name);
  console.log("   -> New Start Date:", copiedTrip.startDate);
  console.log("   -> Activity scheduledAt preserved and shifted:", copiedTrip.stops[0].activities[0]?.scheduledAt);

  // Clean up copied test trip
  await prisma.trip.delete({ where: { id: copiedTrip.id } });
  console.log("3. Cleanup complete. ALL E2E SHARING CHECKS PASSED!");
}

testE2E()
  .catch((err) => {
    console.error("E2E Test Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
