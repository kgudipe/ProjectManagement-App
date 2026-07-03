import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  getTasksByPriority,
  getUserTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/taskController.js";
import { validate } from "../middleware/validate.js";
import {
  createTaskSchema,
  priorityParamSchema,
  projectIdQuerySchema,
  taskIdParamSchema,
  updateStatusSchema,
  updateTaskSchema,
  userIdParamSchema,
} from "../schemas/taskSchemas.js";

const router = Router();

router.get("/", validate({ query: projectIdQuerySchema }), getTasks);
router.post("/", validate({ body: createTaskSchema }), createTask);
router.get("/priority/:priority", validate({ params: priorityParamSchema }), getTasksByPriority);
router.get("/user/:userId", validate({ params: userIdParamSchema }), getUserTasks);
router.patch(
  "/:taskId/status",
  validate({ params: taskIdParamSchema, body: updateStatusSchema }),
  updateTaskStatus
);
router.patch(
  "/:taskId",
  validate({ params: taskIdParamSchema, body: updateTaskSchema }),
  updateTask
);
router.delete("/:taskId", validate({ params: taskIdParamSchema }), deleteTask);

export default router;
