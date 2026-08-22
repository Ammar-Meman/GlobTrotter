import bcrypt from "bcrypt";
import crypto from "crypto";
import prisma from "../lib/prisma.js";
import { generateToken } from "../lib/jwt.js";
import { ConflictError, UnauthorizedError } from "../lib/errors.js";

export const signup = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      photoUrl: true,
      language: true,
    },
  });

  const token = generateToken({ id: user.id, email: user.email });

  return {
    token,
    user,
  };
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new UnauthorizedError("invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("invalid email or password");
  }

  const token = generateToken({ id: user.id, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
      language: user.language,
    },
  };
};

export const forgotPassword = async ({ email }) => {
  // SECURITY: Always return the same response regardless of whether the email
  // exists — this prevents user-enumeration via timing or response differences.
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    // Generate a secure reset token — in production, store its hash in the DB
    // and send it via email rather than logging it.
    const resetToken = crypto.randomBytes(32).toString("hex");
    // TODO: persist hashed token to DB and email it to the user via a mail service.
    // DO NOT log the token — it is a credential.
    void resetToken; // suppress unused-variable lint warning until email is wired up
  }

  // Always return the same message to prevent user enumeration.
  return {
    message: "If that email is registered, a password reset link has been sent.",
  };
};
