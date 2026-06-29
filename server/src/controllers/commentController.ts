import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { notFoundError } from "../lib/httpError.js";

export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const taskId = Number(req.query.taskId);
  const comments = await prisma.comment.findMany({
    where: { taskId },
    include: { user: true },
    orderBy: { id: "asc" },
  });
  res.json(comments);
});

export const createComment = asyncHandler(async (req: Request, res: Response) => {
  const { text, taskId, userId } = req.body;
  const comment = await prisma.comment.create({
    data: { text, taskId, userId },
    include: { user: true },
  });
  res.status(201).json(comment);
});

export const updateComment = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { text } = req.body;

  const existing = await prisma.comment.findUnique({ where: { id } });
  if (!existing) throw notFoundError("Comment");

  const updated = await prisma.comment.update({
    where: { id },
    data: { text },
    include: { user: true },
  });
  res.json(updated);
});

export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const existing = await prisma.comment.findUnique({ where: { id } });
  if (!existing) throw notFoundError("Comment");

  await prisma.comment.delete({ where: { id } });
  res.status(204).send();
});
