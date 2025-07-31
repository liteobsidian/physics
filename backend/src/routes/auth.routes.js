import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { User } from "../models/index.js";

const router = express.Router();
const userController = new AuthController(User);

router.post("/register", userController.registerUser.bind(userController));
router.post("/login", userController.loginUser.bind(userController));
router.get("/confirm.register/:token", userController.confirmRegister.bind(userController));

export default router;
