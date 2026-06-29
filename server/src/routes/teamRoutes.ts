import { Router } from "express";
import {
  assignTeamToProject,
  createTeam,
  getTeams,
} from "../controllers/teamController.js";
import { validate } from "../middleware/validate.js";
import { assignProjectSchema, createTeamSchema } from "../schemas/teamSchemas.js";

const router = Router();

router.get("/", getTeams);
router.post("/", validate({ body: createTeamSchema }), createTeam);
router.post("/assign", validate({ body: assignProjectSchema }), assignTeamToProject);

export default router;
