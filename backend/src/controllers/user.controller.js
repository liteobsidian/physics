import { where } from "sequelize";
import { sequelize } from "../config/db.js";
import { updateTokens } from "../middlewares/auth.middleware.js";
import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";
import { isPasswordMatch } from "../utils/passwordHasher.js";
dotenv.config();

export class UserController {
    constructor(model) {
        this.model = model;
    }
    async getUserInfo(req, res) {
        try {
            const token = req.cookies?.access_token;
            if (!token) return res.status(401).json({ message: "Токен отсутвует" });

            let decoded;
            try {
                decoded = jwt.verify(token, process.env.ACCESS_SECRET);
            } catch (e) {
                return res.status(401).json({ message: "Не валидный токен" });
            }

            const user = await this.model.findOne({
                where: { id: decoded.id },
                attributes: { exclude: ["password"] },
            });

            if (!user) return res.status(404).json({ message: "Пользователь не найден" });

            return res.status(200).json({ user });
        } catch (error) {
            return res.status(500).json({ message: `Ошибка сервера: ${error}` });
        }
    }

    async completeTask(req, res) {
        const token = req.cookies?.access_token;
        if (!token) return res.status(401).json({ message: "Токен отсутвует" });

        const { exercise_id, exercise_type, topic_id } = req.body;
        const t = await sequelize.transaction();

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.ACCESS_SECRET);

            const result = await this.model.create(
                {
                    user_id: decoded.id,
                    exercise_id: exercise_id,
                    exercise_type: exercise_type,
                    topic_id: topic_id,
                },
                { transaction: t }
            );
            t.commit();
            return res.status(200).json({ message: "Задание выполнено" });
        } catch (error) {
            if (error.status === 401) {
                return res.status(401).json({ message: "Не валидный токен" });
            }
            t.rollback();
            throw error;
        }
    }

    async getCompeletedTasks(req, res) {
        const token = req.cookies?.access_token;
        if (!token) return res.status(401).json({ message: "Токен отсутвует" });

        const t = await sequelize.transaction();

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.ACCESS_SECRET);

            const result = await this.model.findAll(
                {
                    where: {
                        user_id: decoded.id,
                    },
                    attributes: { exclude: ["user_id", "id"] },
                },
                { transaction: t }
            );

            if (res.status === 403) {
                return res.status(200).json([], { message: "Пользователь не авторизирован" });
            }
            t.commit();
            return res.status(200).json(result);
        } catch (error) {
            if (error.status === 401) {
                return res.status(401).json({ message: "Не валидный токен" });
            }
            t.rollback();
            throw error;
        }
    }

    async changePassword(req, res) {
        const { currentPassword, newPassword } = req.body;
        const token = req.cookies?.access_token;
        if (!token) return res.status(401).json({ message: "Токен отсутвует" });

        const t = sequelize.transaction();
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_SECRET);

            const user = await this.model.findOne({
                where: {
                    id: decoded.id,
                },
                attributes: { exclude: ["username", "email", ""] },
            });
        } catch (error) {}
    }
}
