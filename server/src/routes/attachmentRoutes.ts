import { Router } from "express";
import {
  createAttachment,
  deleteAttachment,
  getAttachments,
  presignUpload,
} from "../controllers/attachmentController.js";
import { validate } from "../middleware/validate.js";
import {
  attachmentIdParamSchema,
  createAttachmentSchema,
  presignSchema,
  taskIdQuerySchema,
} from "../schemas/attachmentSchemas.js";

const router = Router();

router.get("/", validate({ query: taskIdQuerySchema }), getAttachments);
router.post("/presign", validate({ body: presignSchema }), presignUpload);
router.post("/", validate({ body: createAttachmentSchema }), createAttachment);
router.delete("/:id", validate({ params: attachmentIdParamSchema }), deleteAttachment);

export default router;
