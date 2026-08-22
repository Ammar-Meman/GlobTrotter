import prisma from "../lib/prisma.js";
import { NotFoundError } from "../lib/errors.js";

export const updateMe = async (userId, data) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl }),
      ...(data.language !== undefined && { language: data.language }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      photoUrl: true,
      language: true,
      isAdmin: true,
    },
  });

  return updatedUser;
};

export const deleteMe = async (userId) => {
  await prisma.user.delete({
    where: { id: userId },
  });

  return {
    message: "account deleted",
  };
};

export const getSavedDestinations = async (userId) => {
  const saved = await prisma.savedDestination.findMany({
    where: { userId },
    select: {
      id: true,
      cityName: true,
    },
  });

  return saved;
};

export const addSavedDestination = async (userId, { cityName }) => {
  const saved = await prisma.savedDestination.create({
    data: {
      cityName,
      userId,
    },
    select: {
      id: true,
      cityName: true,
    },
  });

  return saved;
};

export const deleteSavedDestination = async (userId, destinationId) => {
  const destination = await prisma.savedDestination.findFirst({
    where: {
      id: destinationId,
      userId,
    },
  });

  if (!destination) {
    throw new NotFoundError("Saved destination not found");
  }

  await prisma.savedDestination.delete({
    where: { id: destinationId },
  });

  return {
    message: "removed",
  };
};
