import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { notFoundError } from "../lib/httpError.js";
import { createUploadUrl, deleteObjectByUrl } from "../lib/s3.js";

export const getAttachments = asyncHandler(async (req: Request, res: Response) => {
  const taskId = Number(req.query.taskId);
  const attachments = await prisma.attachment.findMany({
    where: { taskId },
    include: { uploadedBy: { select: { userId: true, username: true } } },
    orderBy: { id: "asc" },
  });
  res.json(attachments);
});

/** Step 1: hand the browser a presigned URL to upload the file straight to S3. */
export const presignUpload = asyncHandler(async (req: Request, res: Response) => {
  const { fileName, contentType, taskId } = req.body;

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw notFoundError("Task");

  const result = await createUploadUrl({ taskId, fileName, contentType });
  res.json(result);
});

/** Step 2: after the browser uploads to S3, persist the attachment metadata. */
export const createAttachment = asyncHandler(async (req: Request, res: Response) => {
  const { fileURL, fileName, taskId, uploadedById } = req.body;

  const attachment = await prisma.attachment.create({
    data: { fileURL, fileName, taskId, uploadedById },
    include: { uploadedBy: { select: { userId: true, username: true } } },
  });
  res.status(201).json(attachment);
});

export const deleteAttachment = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const existing = await prisma.attachment.findUnique({ where: { id } });
  if (!existing) throw notFoundError("Attachment");

  await deleteObjectByUrl(existing.fileURL);
  await prisma.attachment.delete({ where: { id } });
  res.status(204).send();
});
