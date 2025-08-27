import express from "express";
import { StudyExercise, CheckExercise, RepetitionExercise } from "../models/index.js";
import { AdminController } from "../controllers/admin.controller.js";
import { updateTokens } from "../middlewares/auth.middleware.js";

const router = express.Router();
const adminTasksController = new AdminController({ StudyExercise, CheckExercise, RepetitionExercise });

router.post("/add-task-admin", updateTokens, adminTasksController.addTask.bind(adminTasksController));
router.put("/edit-task-admin", updateTokens, adminTasksController.editTask.bind(adminTasksController));

export default router;
