import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const search = asyncHandler(async (req: Request, res: Response) => {
  const query = (req.query.query as string) ?? "";

  const [tasks, projects, users] = await Promise.all([
    prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
    prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
    prisma.user.findMany({
      where: { username: { contains: query, mode: "insensitive" } },
    }),
  ]);

  res.json({ tasks, projects, users });
});
