import prisma from "../lib/prisma.js";
import { NotFoundError, ForbiddenError } from "../lib/errors.js";

export const createTrip = async (userId, data) => {
  const trip = await prisma.trip.create({
    data: {
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      description: data.description ?? null,
      coverPhoto: data.coverPhoto ?? null,
      budgetLimit: data.budgetLimit ?? null,
      userId,
    },
    include: {
      stops: true,
    },
  });

  return trip;
};

export const getTrips = async (userId) => {
  const trips = await prisma.trip.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      description: true,
      coverPhoto: true,
      createdAt: true,
      _count: {
        select: { stops: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return trips.map((trip) => ({
    id: trip.id,
    name: trip.name,
    startDate: trip.startDate,
    endDate: trip.endDate,
    description: trip.description,
    coverPhoto: trip.coverPhoto,
    stopCount: trip._count.stops,
    createdAt: trip.createdAt,
  }));
};

export const getTripById = async (userId, tripId) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      stops: {
        orderBy: { order: "asc" },
        include: {
          activities: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              name: true,
              type: true,
              category: true,
              cost: true,
              duration: true,
              description: true,
              imageUrl: true,
              order: true,
            },
          },
        },
      },
    },
  });

  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  if (trip.userId !== userId) {
    throw new ForbiddenError("You do not have access to this trip");
  }

  return {
    id: trip.id,
    name: trip.name,
    startDate: trip.startDate,
    endDate: trip.endDate,
    description: trip.description,
    coverPhoto: trip.coverPhoto,
    shareId: trip.shareId,
    isPublic: trip.isPublic,
    stops: trip.stops.map((stop) => ({
      id: stop.id,
      cityName: stop.cityName,
      country: stop.country,
      latitude: stop.latitude,
      longitude: stop.longitude,
      costIndex: stop.costIndex,
      popularity: stop.popularity,
      startDate: stop.startDate,
      endDate: stop.endDate,
      order: stop.order,
      activities: stop.activities,
    })),
  };
};

export const getPublicTripByShareId = async (shareId) => {
  const trip = await prisma.trip.findUnique({
    where: { shareId },
    include: {
      stops: {
        orderBy: { order: "asc" },
        include: {
          activities: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              name: true,
              type: true,
              category: true,
              cost: true,
              duration: true,
              description: true,
              imageUrl: true,
              order: true,
            },
          },
        },
      },
    },
  });

  if (!trip || !trip.isPublic) {
    throw new NotFoundError("Trip not found or not public");
  }

  return {
    id: trip.id,
    name: trip.name,
    startDate: trip.startDate,
    endDate: trip.endDate,
    description: trip.description,
    coverPhoto: trip.coverPhoto,
    shareId: trip.shareId,
    isPublic: trip.isPublic,
    stops: trip.stops.map((stop) => ({
      id: stop.id,
      cityName: stop.cityName,
      country: stop.country,
      latitude: stop.latitude,
      longitude: stop.longitude,
      costIndex: stop.costIndex,
      popularity: stop.popularity,
      startDate: stop.startDate,
      endDate: stop.endDate,
      order: stop.order,
      activities: stop.activities,
    })),
  };
};

export const copyTrip = async (userId, tripId) => {
  const sourceTrip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      stops: {
        orderBy: { order: "asc" },
        include: {
          activities: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!sourceTrip) {
    throw new NotFoundError("Trip not found");
  }

  const origStart = new Date(sourceTrip.startDate);
  const origEnd = new Date(sourceTrip.endDate);
  const durationMs = origEnd.getTime() - origStart.getTime();

  const now = new Date();
  const newStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const newEnd = new Date(newStart.getTime() + durationMs);

  const newTrip = await prisma.trip.create({
    data: {
      name: `${sourceTrip.name} (Copy)`,
      startDate: newStart,
      endDate: newEnd,
      description: sourceTrip.description,
      coverPhoto: sourceTrip.coverPhoto,
      budgetLimit: sourceTrip.budgetLimit,
      isPublic: false,
      userId,
      stops: {
        create: sourceTrip.stops.map((stop) => {
          const stopStart = new Date(stop.startDate);
          const stopEnd = new Date(stop.endDate);
          const stopOffset = stopStart.getTime() - origStart.getTime();
          const stopDuration = stopEnd.getTime() - stopStart.getTime();

          const newStopStart = new Date(newStart.getTime() + stopOffset);
          const newStopEnd = new Date(newStopStart.getTime() + stopDuration);

          return {
            cityName: stop.cityName,
            country: stop.country,
            latitude: stop.latitude,
            longitude: stop.longitude,
            costIndex: stop.costIndex,
            popularity: stop.popularity,
            startDate: newStopStart,
            endDate: newStopEnd,
            order: stop.order,
            activities: {
              create: stop.activities.map((act) => ({
                name: act.name,
                type: act.type,
                category: act.category,
                cost: act.cost,
                duration: act.duration,
                description: act.description,
                imageUrl: act.imageUrl,
                order: act.order,
              })),
            },
          };
        }),
      },
    },
    include: {
      stops: {
        orderBy: { order: "asc" },
        include: {
          activities: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              name: true,
              type: true,
              category: true,
              cost: true,
              duration: true,
              description: true,
              imageUrl: true,
              order: true,
            },
          },
        },
      },
    },
  });

  return {
    id: newTrip.id,
    name: newTrip.name,
    startDate: newTrip.startDate,
    endDate: newTrip.endDate,
    description: newTrip.description,
    coverPhoto: newTrip.coverPhoto,
    shareId: newTrip.shareId,
    isPublic: newTrip.isPublic,
    stops: newTrip.stops.map((stop) => ({
      id: stop.id,
      cityName: stop.cityName,
      country: stop.country,
      latitude: stop.latitude,
      longitude: stop.longitude,
      costIndex: stop.costIndex,
      popularity: stop.popularity,
      startDate: stop.startDate,
      endDate: stop.endDate,
      order: stop.order,
      activities: stop.activities,
    })),
  };
};

export const updateTrip = async (userId, tripId, data) => {
  const existingTrip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!existingTrip) {
    throw new NotFoundError("Trip not found");
  }

  if (existingTrip.userId !== userId) {
    throw new ForbiddenError("You do not have access to this trip");
  }

  const updatedTrip = await prisma.trip.update({
    where: { id: tripId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
      ...(data.endDate !== undefined && { endDate: new Date(data.endDate) }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.coverPhoto !== undefined && { coverPhoto: data.coverPhoto }),
      ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      ...(data.budgetLimit !== undefined && { budgetLimit: data.budgetLimit }),
    },
  });

  return updatedTrip;
};

export const deleteTrip = async (userId, tripId) => {
  const existingTrip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!existingTrip) {
    throw new NotFoundError("Trip not found");
  }

  if (existingTrip.userId !== userId) {
    throw new ForbiddenError("You do not have access to this trip");
  }

  await prisma.trip.delete({
    where: { id: tripId },
  });

  return {
    message: "trip deleted",
  };
};
