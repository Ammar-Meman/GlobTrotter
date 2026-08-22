import prisma from "../lib/prisma.js";
import { NotFoundError, ForbiddenError } from "../lib/errors.js";

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

export const reorderActivities = async (userId, stopId, activityIds) => {
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

  await prisma.$transaction(
    activityIds.map((id, index) =>
      prisma.activity.updateMany({
        where: { id, stopId },
        data: { order: index },
      })
    )
  );

  return { message: "reordered" };
};
