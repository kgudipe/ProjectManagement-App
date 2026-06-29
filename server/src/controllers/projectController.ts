import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { notFoundError } from "../lib/httpError.js";

export const getProjects = asyncHandler(async (_req: Request, res: Response) => {
  const projects = await prisma.project.findMany({ orderBy: { id: "asc" } });
  res.json(projects);
});

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const project = await prisma.project.findUnique({
    where: { id },
    include: { projectTeams: { include: { team: true } } },
  });

  if (!project) throw notFoundError("Project");
  res.json(project);
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, startDate, endDate } = req.body;
  const newProject = await prisma.project.create({
    data: {
      name,
      ...(description !== undefined ? { description } : {}),
      ...(startDate !== undefined ? { startDate: new Date(startDate) } : {}),
      ...(endDate !== undefined ? { endDate: new Date(endDate) } : {}),
    },
  });
  res.status(201).json(newProject);
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, description, startDate, endDate } = req.body;

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw notFoundError("Project");

  const updated = await prisma.project.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(startDate !== undefined ? { startDate: startDate ? new Date(startDate) : null } : {}),
      ...(endDate !== undefined ? { endDate: endDate ? new Date(endDate) : null } : {}),
    },
  });

  res.json(updated);
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw notFoundError("Project");

  // Remove dependent records first to satisfy foreign-key constraints.
  await prisma.$transaction(async (tx) => {
    const tasks = await tx.task.findMany({ where: { projectId: id }, select: { id: true } });
    const taskIds = tasks.map((t) => t.id);

    if (taskIds.length > 0) {
      await tx.comment.deleteMany({ where: { taskId: { in: taskIds } } });
      await tx.attachment.deleteMany({ where: { taskId: { in: taskIds } } });
      await tx.taskAssignment.deleteMany({ where: { taskId: { in: taskIds } } });
      await tx.task.deleteMany({ where: { projectId: id } });
    }
    await tx.projectTeam.deleteMany({ where: { projectId: id } });
    await tx.project.delete({ where: { id } });
  });

  res.status(204).send();
});
