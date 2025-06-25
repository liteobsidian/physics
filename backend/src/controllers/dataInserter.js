import dotenv from "dotenv";
dotenv.config();
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as fs from "node:fs";
import { sequelize } from "../config/db.js";
import { Topic, Block, Tag, Exercise } from "../models/index.js";
import { Json } from "sequelize/lib/utils";
import { where } from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const blocksPath = path.resolve(__dirname, "../../../src/data/blocks.json");
const tagsPath = path.resolve(__dirname, "../../../src/data/tags.json");
const topicsPath = path.resolve(__dirname, "../../../src/data/topics.json");
const exercisesPath = path.resolve(
    __dirname,
    "../../../src/data/exercises.json"
);

const blocks = JSON.parse(fs.readFileSync(blocksPath, "utf8"));
const tags = JSON.parse(fs.readFileSync(tagsPath, "utf8"));
const topics = JSON.parse(fs.readFileSync(topicsPath, "utf8"));
const exercises = JSON.parse(fs.readFileSync(exercisesPath, "utf8"));

class DataInserter {
    constructor(model) {
        this.model = model;
    }
    async insertBlocksAndTags(data) {
        const t = await sequelize.transaction();
        try {
            for (const element of Object.values(data)) {
                for (const prop of element) {
                    await this.model.findOrCreate({
                        where: { id: prop.id },
                        defaults: {
                            title: prop.title,
                        },
                        transaction: t,
                    });
                }
            }
            await t.commit();
            return console.log(
                "Данные о блоках и тэгах успешно добавленны в БД"
            );
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
                    await this.model.findOrCreate({
                        where: { id: prop.id },
                        defaults: {
                            title: prop.title,
                            block_id: prop.block_id,
                        },
                        transaction: t,
                    });
                }
            }
            await t.commit();
            return console.log("Данные о темах успешно добавленны в БД");
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }
    async insertTopicTags(data) {
        const t = await sequelize.transaction();
        try {
            for (const element of Object.values(data)) {
                for (const prop of element) {
                    const topic = await this.model.findByPk(prop.id);
                    await topic.addTag(prop.tag_ids, { transaction: t });
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
                for (const prop of element) {
                    // console.log(prop);
                    await this.model.findOrCreate({
                        where: { task: prop.task },
                        defaults: {
                            hint: prop.hint,
                            answer: prop.answer,
                            topic_id: prop.topic_id,
                        },
                        transaction: t,
                    });
                }
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

const tagInserter = new DataInserter(Tag);
await tagInserter.insertBlocksAndTags(tags);

const topicInserter = new DataInserter(Topic);
await topicInserter.insertTopics(topics);

const topicTagsInserter = new DataInserter(Topic);
await topicTagsInserter.insertTopicTags(topics);

// const exerciseInserter = new DataInserter(Exercise);
// await exerciseInserter.insertExercises(exercises);
