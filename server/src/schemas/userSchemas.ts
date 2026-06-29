import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(1).max(100),
  cognitoId: z.string().min(1),
  profilePictureUrl: z.string().optional(),
  teamId: z.coerce.number().int().positive().optional(),
});

export const updateUserSchema = z
  .object({
    username: z.string().min(1).max(100).optional(),
    profilePictureUrl: z.string().optional(),
    teamId: z.coerce.number().int().positive().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const cognitoIdParamSchema = z.object({
  cognitoId: z.string().min(1),
});
