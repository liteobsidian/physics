import express from "express";
import { GetDataController } from "../controllers/getDataController.js";
import { Block, Topic, Exercise, Tag, TopicTag } from "../models/index.js";

const router = express.Router();
const blockDataController = new GetDataController(Block);
const topicDataController = new GetDataController(Topic);
const tagDataController = new GetDataController(Tag);
const exerciseDataController = new GetDataController(Exercise);
const topicWithTagDataController = new GetDataController({ Topic, Tag });

router.get("/block-data", blockDataController.getData.bind(blockDataController));
router.get("/topic-data", topicDataController.getData.bind(topicDataController));
router.get("/tag-data", tagDataController.getData.bind(tagDataController));
router.get("/exercise-data", exerciseDataController.getData.bind(exerciseDataController));
router.get(
    "/topics-with-tags",
    topicWithTagDataController.getTopicsWithTags.bind(topicWithTagDataController)
);

export default router;
