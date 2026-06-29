import { z } from "zod";

export const createTeamSchema = z.object({
  teamName: z.string().min(1).max(150),
  productOwnerUserId: z.coerce.number().int().positive().optional(),
  projectManagerUserId: z.coerce.number().int().positive().optional(),
});

export const assignProjectSchema = z.object({
  teamId: z.coerce.number().int().positive(),
  projectId: z.coerce.number().int().positive(),
});
