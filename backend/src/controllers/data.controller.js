import dotenv from "dotenv";
import jwt from "jsonwebtoken";
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
    async getExercises(req, res) {
        const token = req.cookies?.refresh_token;
        if (!token) {
            return res.status(200).json([]);
        }
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.REFRESH_SECRET);
            if (decoded.role === "admin") {
                const adminData = await this.model.findAll();
                return res.status(200).json(adminData);
            } else {
                const userData = await this.model.findAll({
                    attributes: {
                        exclude: ["answer"],
                    },
                });
                return res.status(200).json(userData);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка сервера", error: error.name });
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
    async getLatestDataVersion(req, res) {
        try {
            const datesReq = await this.model.findAll({
                attributes: ["timestamp"],
                raw: true,
            });
            const dates = Object.values(datesReq).map((u) => Number(u.timestamp));
            if (dates.length === 0) {
                return res.status(200).json(null);
            }
            const maxTimestamp = Math.max(...dates);
            console.log(maxTimestamp);
            const version = await this.model.findOne({
                where: {
                    timestamp: maxTimestamp,
                },
                attributes: ["id"],
            });
            return res.status(200).json(version);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: `Ошибка сервера: ${error}` });
        }
    }
}
