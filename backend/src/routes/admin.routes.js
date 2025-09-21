import express from "express";
import { StudyExercise, CheckExercise, RepetitionExercise, Tag, Block, Topic, TopicTag, User, DataVersion } from "../models/index.js";
import { AdminController } from "../controllers/admin.controller.js";
import { updateTokens } from "../middlewares/auth.middleware.js";

const router = express.Router();
const adminTasksController = new AdminController({ StudyExercise, CheckExercise, RepetitionExercise }, DataVersion);
const adminTagController = new AdminController(Tag, DataVersion);
const adminTopicController = new AdminController(Topic, DataVersion);
const adminBlockController = new AdminController(Block, DataVersion);
const adminConnectController = new AdminController(TopicTag, DataVersion);
const adminUserController = new AdminController(User);

router.post("/add-task-admin", updateTokens, adminTasksController.addTask.bind(adminTasksController));
router.post("/add-tag-admin", updateTokens, adminTagController.addOtherEntites.bind(adminTagController));
router.post("/add-topic-admin", updateTokens, adminTopicController.addTopic.bind(adminTopicController));
router.post("/add-block-admin", updateTokens, adminBlockController.addOtherEntites.bind(adminBlockController));

router.put("/edit-task-admin", updateTokens, adminTasksController.editTask.bind(adminTasksController));
router.put("/edit-tag-admin", updateTokens, adminTagController.updateOtherentites.bind(adminTagController));
router.put("/edit-topic-admin", updateTokens, adminTopicController.updateOtherentites.bind(adminTopicController));
router.put("/edit-block-admin", updateTokens, adminBlockController.updateOtherentites.bind(adminBlockController));

router.delete("/delete-task-admin", updateTokens, adminTasksController.deleteTask.bind(adminTasksController));
router.delete("/delete-tag-admin", updateTokens, adminTagController.deleteOtherEntites.bind(adminTagController));
router.delete("/delete-topic-admin", updateTokens, adminTopicController.deleteOtherEntites.bind(adminTopicController));
router.delete("/delete-block-admin", updateTokens, adminBlockController.deleteOtherEntites.bind(adminBlockController));

router.post("/connect-topic-tag", updateTokens, adminConnectController.connectTagWithTopic.bind(adminConnectController));

router.get("/get-users", updateTokens, adminUserController.getUsers.bind(adminUserController));
router.put("/edit-role", updateTokens, adminUserController.ediUserRole.bind(adminUserController));

export default router;
