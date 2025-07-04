import dotenv from "dotenv";
dotenv.config();

export class GetDataController {
    constructor(model) {
        this.model = model;
        this.Topic = model.Topic;
        this.Tag = model.Tag;
    }
    async getData(req, res) {
        try {
            const result = await this.model.findAll();
            return res.status(200).json(result);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: "Ошибка сервера" });
        }
    }
    async getTopicsWithTags(req, res) {
        try {
            const topics = await this.Topic.findAll({
                include: [
                    {
                        model: this.Tag,
                        through: { attributes: [] },
                    },
                ],
            });
            return res.status(200).json(topics);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: "Ошибка сервера" });
        }
    }
}
