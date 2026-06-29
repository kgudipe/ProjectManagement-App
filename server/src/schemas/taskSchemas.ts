import { z } from "zod";

const isoDate = z.string().datetime({ offset: true }).or(z.string().date());

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  status: z.string().max(50).optional(),
  priority: z.string().max(50).optional(),
  tags: z.string().max(200).optional(),
  startDate: isoDate.optional(),
  dueDate: isoDate.optional(),
  points: z.coerce.number().int().optional(),
  projectId: z.coerce.number().int().positive(),
  authorUserId: z.coerce.number().int().positive(),
  assignedUserId: z.coerce.number().int().positive().optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).nullable().optional(),
    status: z.string().max(50).nullable().optional(),
    priority: z.string().max(50).nullable().optional(),
    tags: z.string().max(200).nullable().optional(),
    startDate: isoDate.nullable().optional(),
    dueDate: isoDate.nullable().optional(),
    points: z.coerce.number().int().nullable().optional(),
    assignedUserId: z.coerce.number().int().positive().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const updateStatusSchema = z.object({
  status: z.string().min(1).max(50),
});

export const taskIdParamSchema = z.object({
  taskId: z.coerce.number().int().positive(),
});

export const userIdParamSchema = z.object({
  userId: z.coerce.number().int().positive(),
});

export const projectIdQuerySchema = z.object({
  projectId: z.coerce.number().int().positive(),
});
