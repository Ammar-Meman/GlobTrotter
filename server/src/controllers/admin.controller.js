import prisma from "../lib/prisma.js";

/**
 * GET /api/admin/stats
 * Returns platform-level aggregate statistics for the admin dashboard.
 */
export const getStats = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Run all heavy queries in parallel
    const [
      totalUsers,
      totalTrips,
      topCitiesRaw,
      topActivitiesRaw,
      activeUsersRaw,
    ] = await Promise.all([
      // 1. Total registered users
      prisma.user.count(),

      // 2. Total trips created
      prisma.trip.count(),

      // 3. Top 5 cities by stop count
      prisma.stop.groupBy({
        by: ["cityName"],
        _count: { cityName: true },
        orderBy: { _count: { cityName: "desc" } },
        take: 5,
      }),

      // 4. Top 5 activities by name occurrence
      prisma.activity.groupBy({
        by: ["name"],
        _count: { name: true },
        orderBy: { _count: { name: "desc" } },
        take: 5,
      }),

      // 5. Distinct users who created a trip in the last 7 days
      prisma.trip.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { userId: true },
        distinct: ["userId"],
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalTrips,
        topCities: topCitiesRaw.map((r) => ({
          cityName: r.cityName,
          count: r._count.cityName,
        })),
        topActivities: topActivitiesRaw.map((r) => ({
          name: r.name,
          count: r._count.name,
        })),
        activeUsersLast7Days: activeUsersRaw.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
