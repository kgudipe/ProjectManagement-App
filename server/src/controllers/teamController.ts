import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { HttpError, notFoundError } from "../lib/httpError.js";

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

export const createTeam = asyncHandler(async (req: Request, res: Response) => {
  const { teamName, productOwnerUserId, projectManagerUserId } = req.body;
  const team = await prisma.team.create({
    data: {
      teamName,
      ...(productOwnerUserId !== undefined ? { productOwnerUserId } : {}),
      ...(projectManagerUserId !== undefined ? { projectManagerUserId } : {}),
    },
  });
  res.status(201).json(team);
});

/** Link a team to a project (ProjectTeam join), enforcing referential integrity. */
export const assignTeamToProject = asyncHandler(async (req: Request, res: Response) => {
  const { teamId, projectId } = req.body;

  const [team, project] = await Promise.all([
    prisma.team.findUnique({ where: { id: teamId } }),
    prisma.project.findUnique({ where: { id: projectId } }),
  ]);
  if (!team) throw notFoundError("Team");
  if (!project) throw notFoundError("Project");

  const existing = await prisma.projectTeam.findFirst({ where: { teamId, projectId } });
  if (existing) throw new HttpError(409, "Team is already assigned to this project");

  const link = await prisma.projectTeam.create({ data: { teamId, projectId } });
  res.status(201).json(link);
});
