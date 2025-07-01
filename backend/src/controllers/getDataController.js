import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "../config/db.js";

export class GetDataController {
    constructor(model) {
        this.model = model;
        this.Topic = model.Topic;
        this.Tag = model.Tag;
    }
    async getData(req, res) {
        const t = await sequelize.transaction();
        try {
            const result = await this.model.findAll();
            await t.commit();
            return res.status(200).json(result);
        } catch (e) {
            console.error(e);
            await t.rollback();
            return res.status(500).json({ error: "Ошибка сервера" });
        }
    }
    async getTopicsWithTags(req, res) {
        const t = await sequelize.transaction();
        try {
            const topics = await this.Topic.findAll({
                include: [
                    {
                        model: this.Tag,
                        through: { attributes: [] },
                    },
                ],
            });
            await t.commit();
            return res.status(200).json(topics);
        } catch (e) {
            console.error(e);
            await t.rollback();
            return res.status(500).json({ error: "Ошибка сервера" });
        }
    }
}
