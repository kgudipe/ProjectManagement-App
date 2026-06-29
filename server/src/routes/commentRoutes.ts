import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/commentController.js";
import { validate } from "../middleware/validate.js";
import {
  commentIdParamSchema,
  createCommentSchema,
  taskIdQuerySchema,
  updateCommentSchema,
} from "../schemas/commentSchemas.js";

const router = Router();

router.get("/", validate({ query: taskIdQuerySchema }), getComments);
router.post("/", validate({ body: createCommentSchema }), createComment);
router.patch(
  "/:id",
  validate({ params: commentIdParamSchema, body: updateCommentSchema }),
  updateComment
);
router.delete("/:id", validate({ params: commentIdParamSchema }), deleteComment);

export default router;
