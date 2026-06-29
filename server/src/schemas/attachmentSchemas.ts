import { z } from "zod";

export const presignSchema = z.object({
  fileName: z.string().min(1).max(255),
  contentType: z.string().min(1).max(150),
  taskId: z.coerce.number().int().positive(),
});

export const createAttachmentSchema = z.object({
  fileURL: z.string().url(),
  fileName: z.string().min(1).max(255).optional(),
  taskId: z.coerce.number().int().positive(),
  uploadedById: z.coerce.number().int().positive(),
});

export const attachmentIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const taskIdQuerySchema = z.object({
  taskId: z.coerce.number().int().positive(),
});
