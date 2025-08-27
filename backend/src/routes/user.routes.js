import express from "express";
import { UserController } from "../controllers/user.controller.js";
import { User, UserProgress } from "../models/index.js";
import { updateTokens, verifyAndRefreshTokens } from "../middlewares/auth.middleware.js";

const router = express.Router();
const userController = new UserController(User);
const userProgressController = new UserController(UserProgress);

router.get("/userinfo", updateTokens, userController.getUserInfo.bind(userController));
router.post("/complete-task", updateTokens, userProgressController.completeTask.bind(userProgressController));
router.get("/get-complited-tasks", updateTokens, userProgressController.getCompeletedTasks.bind(userProgressController));
router.put("/change-password", updateTokens, userController.changePassword.bind(userController));

export default router;
