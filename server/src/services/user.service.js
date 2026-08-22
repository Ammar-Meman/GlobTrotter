import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import { NotFoundError, UnauthorizedError, ValidationError } from "../lib/errors.js";

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

export const deleteMe = async (userId, password) => {
  if (!password) {
    throw new ValidationError("Password is required to delete account");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError("Incorrect password");
  }

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

export const deleteSavedDestination = async (userId, id) => {
  const destination = await prisma.savedDestination.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!destination) {
    throw new NotFoundError("Saved destination not found");
  }

  await prisma.savedDestination.delete({
    where: { id },
  });

  return {
    message: "destination removed",
  };
};
