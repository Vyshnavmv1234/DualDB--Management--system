import { Router } from "express";
import { adminController } from "../controller/admin.controller.js";
import { authenticate } from "../middlewares/user.middleware.js";
import { authorizeAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.use(authenticate);
router.use(authorizeAdmin);

router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.patch("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

export default router;