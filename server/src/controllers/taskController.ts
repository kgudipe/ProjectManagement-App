import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { notFoundError } from "../lib/httpError.js";

const toDate = (value: unknown) => (value === null ? null : new Date(value as string));

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const projectId = Number(req.query.projectId);
  const tasks = await prisma.task.findMany({
    where: { projectId },
    include: { author: true, assignee: true, comments: true, attachments: true },
    orderBy: { id: "asc" },
  });
  res.json(tasks);
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body;

  const newTask = await prisma.task.create({
    data: {
      title,
      description,
      status,
      priority,
      tags,
      ...(startDate !== undefined ? { startDate: new Date(startDate) } : {}),
      ...(dueDate !== undefined ? { dueDate: new Date(dueDate) } : {}),
      points,
      projectId,
      authorUserId,
      assignedUserId,
    },
  });
  res.status(201).json(newTask);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const taskId = Number(req.params.taskId);
  const body = req.body as Record<string, unknown>;

  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) throw notFoundError("Task");

  const data: Prisma.TaskUncheckedUpdateInput = {};
  if ("title" in body) data.title = body.title as string;
  if ("description" in body) data.description = body.description as string | null;
  if ("status" in body) data.status = body.status as string | null;
  if ("priority" in body) data.priority = body.priority as string | null;
  if ("tags" in body) data.tags = body.tags as string | null;
  if ("points" in body) data.points = body.points as number | null;
  if ("assignedUserId" in body) data.assignedUserId = body.assignedUserId as number | null;
  if ("startDate" in body) data.startDate = toDate(body.startDate);
  if ("dueDate" in body) data.dueDate = toDate(body.dueDate);

  const updated = await prisma.task.update({
    where: { id: taskId },
    data,
    include: { author: true, assignee: true },
  });

  res.json(updated);
});

export const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  const taskId = Number(req.params.taskId);
  const { status } = req.body;

  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) throw notFoundError("Task");

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });
  res.json(updatedTask);
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const taskId = Number(req.params.taskId);

  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) throw notFoundError("Task");

  await prisma.$transaction([
    prisma.comment.deleteMany({ where: { taskId } }),
    prisma.attachment.deleteMany({ where: { taskId } }),
    prisma.taskAssignment.deleteMany({ where: { taskId } }),
    prisma.task.delete({ where: { id: taskId } }),
  ]);

  res.status(204).send();
});

export const getUserTasks = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const tasks = await prisma.task.findMany({
    where: {
      OR: [{ authorUserId: userId }, { assignedUserId: userId }],
    },
    include: { author: true, assignee: true },
  });
  res.json(tasks);
});
