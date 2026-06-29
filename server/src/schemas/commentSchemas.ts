import { z } from "zod";

export const createCommentSchema = z.object({
  text: z.string().min(1).max(5000),
  taskId: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
});

export const updateCommentSchema = z.object({
  text: z.string().min(1).max(5000),
});

export const commentIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const taskIdQuerySchema = z.object({
  taskId: z.coerce.number().int().positive(),
});
