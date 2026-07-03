import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { notFoundError } from "../lib/httpError.js";

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { cognitoId } = req.params;
  const user = await prisma.user.findUnique({
    where: { cognitoId: cognitoId! },
    include: { team: true },
  });

  if (!user) throw notFoundError("User");
  res.json(user);
});

export const postUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, cognitoId, profilePictureUrl = "p1.jpeg", teamId } = req.body;

  const newUser = await prisma.user.create({
    data: {
      username,
      cognitoId,
      profilePictureUrl,
      ...(teamId !== undefined ? { teamId } : {}),
    },
  });

  res.status(201).json({ message: "User created successfully", user: newUser });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { cognitoId } = req.params;
  const { username, profilePictureUrl, teamId } = req.body;

  const existing = await prisma.user.findUnique({ where: { cognitoId: cognitoId! } });
  if (!existing) throw notFoundError("User");

  const updated = await prisma.user.update({
    where: { cognitoId: cognitoId! },
    data: {
      ...(username !== undefined ? { username } : {}),
      ...(profilePictureUrl !== undefined ? { profilePictureUrl } : {}),
      ...(teamId !== undefined ? { teamId } : {}),
    },
  });

  res.json(updated);
});
