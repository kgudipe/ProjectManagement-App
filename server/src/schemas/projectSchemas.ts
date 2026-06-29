import { z } from "zod";

const isoDate = z.string().datetime({ offset: true }).or(z.string().date());

export const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  startDate: isoDate.optional(),
  endDate: isoDate.optional(),
});

export const updateProjectSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).nullable().optional(),
    startDate: isoDate.nullable().optional(),
    endDate: isoDate.nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
