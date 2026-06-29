import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";
import { validate } from "../middleware/validate.js";
import {
  createProjectSchema,
  idParamSchema,
  updateProjectSchema,
} from "../schemas/projectSchemas.js";

const router = Router();

router.get("/", getProjects);
router.post("/", validate({ body: createProjectSchema }), createProject);
router.get("/:id", validate({ params: idParamSchema }), getProject);
router.patch(
  "/:id",
  validate({ params: idParamSchema, body: updateProjectSchema }),
  updateProject
);
router.delete("/:id", validate({ params: idParamSchema }), deleteProject);

export default router;
