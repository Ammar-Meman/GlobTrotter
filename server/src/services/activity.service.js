import prisma from "../lib/prisma.js";
import { NotFoundError, ForbiddenError, ValidationError } from "../lib/errors.js";

const validateDateWithinRange = (scheduledAt, startDate, endDate) => {
  const scheduled = new Date(scheduledAt);
  const stopStart = new Date(startDate);
  const stopEnd = new Date(endDate);

  const startBoundary = new Date(
    Date.UTC(stopStart.getUTCFullYear(), stopStart.getUTCMonth(), stopStart.getUTCDate(), 0, 0, 0, 0)
  );
  const endBoundary = new Date(
    Date.UTC(stopEnd.getUTCFullYear(), stopEnd.getUTCMonth(), stopEnd.getUTCDate(), 23, 59, 59, 999)
  );

  if (scheduled < startBoundary || scheduled > endBoundary) {
    throw new ValidationError("scheduledAt must fall within the stop's date range");
  }

  return scheduled;
};

export const createActivity = async (userId, stopId, data) => {
  const stop = await prisma.stop.findUnique({
    where: { id: stopId },
    include: { trip: true },
  });

  if (!stop) {
    throw new NotFoundError("Stop not found");
  }

  if (stop.trip.userId !== userId) {
    throw new ForbiddenError("You do not have permission to modify this stop");
  }

  const scheduledDate = validateDateWithinRange(data.scheduledAt, stop.startDate, stop.endDate);

  const maxOrderResult = await prisma.activity.aggregate({
    where: { stopId },
    _max: { order: true },
  });

  const nextOrder =
    maxOrderResult._max.order !== null && maxOrderResult._max.order !== undefined
      ? maxOrderResult._max.order + 1
      : 0;

  const activity = await prisma.activity.create({
    data: {
      name: data.name,
      type: data.type,
      category: data.category,
      cost: data.cost,
      scheduledAt: scheduledDate,
      duration: data.duration ?? null,
      description: data.description ?? null,
      imageUrl: data.imageUrl ?? null,
      order: nextOrder,
      stopId,
    },
  });

  return activity;
};

export const updateActivity = async (userId, activityId, data) => {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      stop: {
        include: { trip: true },
      },
    },
  });

  if (!activity) {
    throw new NotFoundError("Activity not found");
  }

  if (activity.stop.trip.userId !== userId) {
    throw new ForbiddenError("You do not have permission to modify this activity");
  }

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.cost !== undefined) updateData.cost = data.cost;
  if (data.duration !== undefined) updateData.duration = data.duration;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
  if (data.order !== undefined) updateData.order = data.order;

  if (data.scheduledAt !== undefined) {
    updateData.scheduledAt = validateDateWithinRange(
      data.scheduledAt,
      activity.stop.startDate,
      activity.stop.endDate
    );
  }

  const updatedActivity = await prisma.activity.update({
    where: { id: activityId },
    data: updateData,
  });

  return updatedActivity;
};

export const deleteActivity = async (userId, activityId) => {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      stop: {
        include: { trip: true },
      },
    },
  });

  if (!activity) {
    throw new NotFoundError("Activity not found");
  }

  if (activity.stop.trip.userId !== userId) {
    throw new ForbiddenError("You do not have permission to delete this activity");
  }

  await prisma.activity.delete({
    where: { id: activityId },
  });

  return { message: "activity deleted" };
};

export const reorderActivities = async (userId, stopId, dateStr, activityIds) => {
  const stop = await prisma.stop.findUnique({
    where: { id: stopId },
    include: { trip: true },
  });

  if (!stop) {
    throw new NotFoundError("Stop not found");
  }

  if (stop.trip.userId !== userId) {
    throw new ForbiddenError("You do not have permission to modify this stop");
  }

  const targetDate = new Date(dateStr);
  if (isNaN(targetDate.getTime())) {
    throw new ValidationError("Invalid date provided for reorder");
  }

  const dayStart = new Date(
    Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), 0, 0, 0, 0)
  );
  const dayEnd = new Date(
    Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), 23, 59, 59, 999)
  );

  await prisma.$transaction(
    activityIds.map((id, index) =>
      prisma.activity.updateMany({
        where: {
          id,
          stopId,
          scheduledAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
        data: { order: index },
      })
    )
  );

  return { message: "reordered" };
};
