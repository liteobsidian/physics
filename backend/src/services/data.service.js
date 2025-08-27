import dotenv from "dotenv";
dotenv.config();
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as fs from "node:fs";
import { sequelize } from "../config/db.js";
import { Topic, Block, Tag, StudyExercise, RepetitionExercise, CheckExercise, TopicTag } from "../models/index.js";
import { getImgBuffer } from "../middlewares/getImgBuffer.middleware.js";
import { Json } from "sequelize/lib/utils";
import { where } from "sequelize";
import { title } from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const blocksPath = path.resolve(__dirname, "../../../src/data/blocks.json");
const tagsPath = path.resolve(__dirname, "../../../src/data/tags.json");
const topicsPath = path.resolve(__dirname, "../../../src/data/topics.json");
const exercisesPath = path.resolve(__dirname, "../../../src/data/exercises.json");

const blocks = JSON.parse(fs.readFileSync(blocksPath, "utf8"));
const tags = JSON.parse(fs.readFileSync(tagsPath, "utf8"));
const topics = JSON.parse(fs.readFileSync(topicsPath, "utf8"));
const exercises = JSON.parse(fs.readFileSync(exercisesPath, "utf8"));

export class DataInserter {
    constructor(model) {
        this.model = model;
        this.Topic = model.Topic;
        this.TopicTag = model.TopicTag;
    }
    async insertBlocksAndTags(data) {
        const t = await sequelize.transaction();
        try {
            for (const element of Object.values(data)) {
                for (const prop of element) {
                    await this.model.findOrCreate({
                        where: { title: prop.title },
                        defaults: { title: prop.title },
                        transaction: t,
                    });
                }
            }
            await t.commit();
            return console.log("Данные о блоках и тэгах успешно добавленны в БД");
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }
    async insertTopics(data) {
        const t = await sequelize.transaction();
        try {
            for (const element of Object.values(data)) {
                for (const prop of element) {
                    await this.model.create(
                        {
                            title: prop.title,
                            block_id: prop.block_id,
                        },
                        {
                            transaction: t,
                        }
                    );
                }
            }
            await t.commit();
            return console.log("Данные о темах успешно добавленны в БД");
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }
    async insertTopicTags(topicsData) {
        const t = await sequelize.transaction();
        try {
            const dbTopics = await this.Topic.findAll({ attributes: ["id", "title"] });

            for (const fileTopicArr of Object.values(topicsData)) {
                for (const fileTopic of fileTopicArr) {
                    const dbTopic = dbTopics.find((t) => t.title === fileTopic.title);
                    if (!dbTopic) continue;
                    if (!fileTopic.tag_ids) continue;
                    await dbTopic.addTags(fileTopic.tag_ids, { transaction: t });
                }
            }

            await t.commit();
            return console.log("Данные успешно добавленны в JOIN таблицу");
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }
    async insertExercises(data) {
        const t = await sequelize.transaction();
        try {
            for (const element of Object.values(data)) {
                await this.model.findOrCreate({
                    where: { task: await getImgBuffer(element.task) },
                    defaults: {
                        hint: element.hint,
                        answer: element.answer,
                        topic_id: element.topic_id,
                    },
                    transaction: t,
                });
            }
            await t.commit();
            return console.log("Данные о заданиях успешно добавленны в БД");
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }
}

const blockInserter = new DataInserter(Block);
await blockInserter.insertBlocksAndTags(blocks);

const tagsInserter = new DataInserter(Tag);
await tagsInserter.insertBlocksAndTags(tags);

const topicsInserter = new DataInserter(Topic);
await topicsInserter.insertTopics(topics);

const topicTagsInserter = new DataInserter({ Topic, TopicTag });
await topicTagsInserter.insertTopicTags(topics);

const studyExerciseInserter = new DataInserter(StudyExercise);
await studyExerciseInserter.insertExercises(exercises.study_exercises);

const checkExerciseInserter = new DataInserter(CheckExercise);
await checkExerciseInserter.insertExercises(exercises.check_exercises);

const repetitionExerciseInserter = new DataInserter(RepetitionExercise);
await repetitionExerciseInserter.insertExercises(exercises.repetition_exercises);
