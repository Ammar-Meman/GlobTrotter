import prisma from "../lib/prisma.js";
import { NotFoundError, ForbiddenError } from "../lib/errors.js";

export const getTripBudget = async (userId, tripId) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      stops: {
        include: {
          activities: true,
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  if (trip.userId !== userId) {
    throw new ForbiddenError("You do not have permission to view this trip's budget");
  }

  const dailyBudgetThreshold = trip.budgetLimit ?? 150;

  const byCategory = {
    transport: 0,
    stay: 0,
    activity: 0,
    meal: 0,
  };

  let totalCost = 0;

  // Compute date range for the trip
  const tripStart = new Date(trip.startDate);
  const tripEnd = new Date(trip.endDate);

  const startUtc = new Date(
    Date.UTC(tripStart.getUTCFullYear(), tripStart.getUTCMonth(), tripStart.getUTCDate())
  );
  const endUtc = new Date(
    Date.UTC(tripEnd.getUTCFullYear(), tripEnd.getUTCMonth(), tripEnd.getUTCDate())
  );

  const dayCostMap = new Map();
  const daySet = new Set();

  let cur = new Date(startUtc);
  while (cur <= endUtc) {
    const iso = cur.toISOString();
    daySet.add(iso);
    dayCostMap.set(iso, 0);
    cur.setUTCDate(cur.getUTCDate() + 1);
  }

  if (daySet.size === 0) {
    const iso = startUtc.toISOString();
    daySet.add(iso);
    dayCostMap.set(iso, 0);
  }

  for (const stop of trip.stops) {
    let stopTotalCost = 0;
    for (const activity of stop.activities) {
      const actCost = activity.cost || 0;
      totalCost += actCost;
      if (byCategory[activity.category] !== undefined) {
        byCategory[activity.category] += actCost;
      } else {
        byCategory[activity.category] = actCost;
      }
      stopTotalCost += actCost;
    }

    const stopStart = new Date(stop.startDate);
    const stopEnd = new Date(stop.endDate);
    const sStartUtc = new Date(
      Date.UTC(stopStart.getUTCFullYear(), stopStart.getUTCMonth(), stopStart.getUTCDate())
    );
    const sEndUtc = new Date(
      Date.UTC(stopEnd.getUTCFullYear(), stopEnd.getUTCMonth(), stopEnd.getUTCDate())
    );

    const stopDays = [];
    let sCur = new Date(sStartUtc);
    while (sCur <= sEndUtc) {
      stopDays.push(sCur.toISOString());
      sCur.setUTCDate(sCur.getUTCDate() + 1);
    }

    if (stopDays.length === 0) {
      stopDays.push(sStartUtc.toISOString());
    }

    const costPerDay = stopTotalCost / stopDays.length;
    for (const d of stopDays) {
      if (!dayCostMap.has(d)) {
        dayCostMap.set(d, 0);
        daySet.add(d);
      }
      dayCostMap.set(d, dayCostMap.get(d) + costPerDay);
    }
  }

  const sortedDays = Array.from(daySet).sort();
  const byDay = sortedDays.map((date) => {
    const cost = Math.round((dayCostMap.get(date) || 0) * 100) / 100;
    return {
      date,
      cost,
      overBudget: cost > dailyBudgetThreshold,
    };
  });

  const totalDays = sortedDays.length > 0 ? sortedDays.length : 1;
  const averagePerDay = Math.round((totalCost / totalDays) * 10) / 10;

  const roundedByCategory = {
    transport: Math.round(byCategory.transport * 100) / 100,
    stay: Math.round(byCategory.stay * 100) / 100,
    activity: Math.round(byCategory.activity * 100) / 100,
    meal: Math.round(byCategory.meal * 100) / 100,
  };

  return {
    totalCost: Math.round(totalCost * 100) / 100,
    byCategory: roundedByCategory,
    byDay,
    averagePerDay,
    dailyBudgetThreshold,
  };
};
