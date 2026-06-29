import { Router } from "express";
import { getUsers, postUser, getUser, updateUser } from "../controllers/userController.js";
import { validate } from "../middleware/validate.js";
import {
  cognitoIdParamSchema,
  createUserSchema,
  updateUserSchema,
} from "../schemas/userSchemas.js";

const router = Router();

router.get("/", getUsers);
router.post("/", validate({ body: createUserSchema }), postUser);
router.get("/:cognitoId", validate({ params: cognitoIdParamSchema }), getUser);
router.patch(
  "/:cognitoId",
  validate({ params: cognitoIdParamSchema, body: updateUserSchema }),
  updateUser
);

export default router;
