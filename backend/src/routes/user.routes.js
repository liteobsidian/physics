import express from "express";
import { UserController } from "../controllers/user.controller.js";
import { GetDataController } from "../controllers/data.controller.js";
import { User, UserProgress } from "../models/index.js";
import { updateTokens, verifyAndRefreshTokens } from "../middlewares/auth.middleware.js";

const router = express.Router();
const userController = new UserController(User);
const userProgressController = new UserController(UserProgress);

router.get("/userinfo", updateTokens, verifyAndRefreshTokens, userController.getUserInfo.bind(userController));
router.post("/complete-task", updateTokens, verifyAndRefreshTokens, userProgressController.completeTask.bind(userProgressController));
router.get("/get-complited-tasks", updateTokens, verifyAndRefreshTokens, userProgressController.getCompeletedTasks.bind(userProgressController));

export default router;
