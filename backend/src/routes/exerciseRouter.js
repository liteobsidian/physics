import express from "express";
import { GetDataController } from "../controllers/getDataController.js";
import { Block, Topic, Tag, StudyExercise, RepetitionExercise, CheckExercise } from "../models/index.js";

const router = express.Router();
const blockDataController = new GetDataController(Block);
const topicDataController = new GetDataController(Topic);
const tagDataController = new GetDataController(Tag);
const studyExerciseDataController = new GetDataController(StudyExercise);
const repetitionExerciseDataController = new GetDataController(RepetitionExercise);
const checkExerciseDataController = new GetDataController(CheckExercise);
const topicWithTagDataController = new GetDataController({ Topic, Tag });

router.get("/block-data", blockDataController.getData.bind(blockDataController));
router.get("/topic-data", topicDataController.getData.bind(topicDataController));
router.get("/tag-data", tagDataController.getData.bind(tagDataController));
router.get("/studyexercise-data", studyExerciseDataController.getData.bind(studyExerciseDataController));
router.get("/repetitionexercise-data", repetitionExerciseDataController.getData.bind(repetitionExerciseDataController));
router.get("/checkexercise-data", checkExerciseDataController.getData.bind(checkExerciseDataController));
router.get("/topics-with-tags", topicWithTagDataController.getTopicsWithTags.bind(topicWithTagDataController));

export default router;
