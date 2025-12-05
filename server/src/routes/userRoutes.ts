import { Router } from "express";
import { getUsers } from "../controllers/userController.ts";

const router = Router();

router.get("/", getUsers);

export default router;