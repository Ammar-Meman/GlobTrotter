import prisma from "../lib/prisma.js";
import { NotFoundError, ForbiddenError } from "../lib/errors.js";

export const createStop = async (userId, tripId, data) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  if (trip.userId !== userId) {
    throw new ForbiddenError("You do not have permission to modify this trip");
  }

  const maxOrderResult = await prisma.stop.aggregate({
    where: { tripId },
    _max: { order: true },
  });

  const nextOrder =
    maxOrderResult._max.order !== null && maxOrderResult._max.order !== undefined
      ? maxOrderResult._max.order + 1
      : 0;

  const stop = await prisma.stop.create({
    data: {
      cityName: data.cityName,
      country: data.country ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      costIndex: data.costIndex ?? null,
      popularity: data.popularity ?? null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      order: nextOrder,
      tripId,
    },
    include: {
      activities: true,
    },
  });

  return stop;
};

export const updateStop = async (userId, stopId, data) => {
  const stop = await prisma.stop.findUnique({
    where: { id: stopId },
    include: { trip: true, activities: true },
  });

  if (!stop) {
    throw new NotFoundError("Stop not found");
  }

  if (stop.trip.userId !== userId) {
    throw new ForbiddenError("You do not have permission to modify this stop");
  }

  const updateData = {};
  if (data.cityName !== undefined) updateData.cityName = data.cityName;
  if (data.country !== undefined) updateData.country = data.country;
  if (data.latitude !== undefined) updateData.latitude = data.latitude;
  if (data.longitude !== undefined) updateData.longitude = data.longitude;
  if (data.costIndex !== undefined) updateData.costIndex = data.costIndex;
  if (data.popularity !== undefined) updateData.popularity = data.popularity;
  if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
  if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
  if (data.order !== undefined) updateData.order = data.order;

  const updatedStop = await prisma.stop.update({
    where: { id: stopId },
    data: updateData,
    include: { activities: true },
  });

  return updatedStop;
};

export const deleteStop = async (userId, stopId) => {
  const stop = await prisma.stop.findUnique({
    where: { id: stopId },
    include: { trip: true },
  });

  if (!stop) {
    throw new NotFoundError("Stop not found");
  }

  if (stop.trip.userId !== userId) {
    throw new ForbiddenError("You do not have permission to delete this stop");
  }

  await prisma.stop.delete({
    where: { id: stopId },
  });

  return { message: "stop deleted" };
};

export const reorderStops = async (userId, tripId, stopIds) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  if (trip.userId !== userId) {
    throw new ForbiddenError("You do not have permission to modify this trip");
  }

  await prisma.$transaction(
    stopIds.map((id, index) =>
      prisma.stop.updateMany({
        where: { id, tripId },
        data: { order: index },
      })
    )
  );

  return { message: "reordered" };
};
