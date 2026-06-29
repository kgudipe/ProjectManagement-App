import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getTeams = asyncHandler(async (_req: Request, res: Response) => {
  const teams = await prisma.team.findMany();

  const teamsWithUsernames = await Promise.all(
    teams.map(async (team) => {
      const productOwner = team.productOwnerUserId
        ? await prisma.user.findUnique({
            where: { userId: team.productOwnerUserId },
            select: { username: true },
          })
        : null;

      const projectManager = team.projectManagerUserId
        ? await prisma.user.findUnique({
            where: { userId: team.projectManagerUserId },
            select: { username: true },
          })
        : null;

      return {
        ...team,
        productOwnerUsername: productOwner?.username,
        projectManagerUsername: projectManager?.username,
      };
    })
  );

  res.json(teamsWithUsernames);
});
