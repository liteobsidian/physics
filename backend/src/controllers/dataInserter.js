import dotenv from "dotenv";
dotenv.config();
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as fs from "node:fs";
import { sequelize } from "../config/db.js";
import { Block } from "../models/blocks.js";
import { Tag } from "../models/tags.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const blocksPath = path.resolve(__dirname, "../../../src/data/blocks.json");
const tagsPath = path.resolve(__dirname, "../../../src/data/tags.json");

const blocks = JSON.parse(fs.readFileSync(blocksPath, "utf8"));
const tags = JSON.parse(fs.readFileSync(tagsPath, "utf8"));

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
            return "Данные о блоках успешно добавленны в БД";
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }
    async insertTopics(data) {
        const t = await sequelize.transaction();
        try {
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
