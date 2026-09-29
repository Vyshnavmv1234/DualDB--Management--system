import { Router } from "express";
import { userController } from "../controller/user.controller.js";
import { authenticate } from "../middlewares/user.middleware.js";

const router = Router();

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/profile", authenticate, userController.getProfile);
router.patch("/profile", authenticate, userController.updateProfile);
router.delete("/profile", authenticate, userController.deleteAccount);

export default router;
