import { sequelize } from "../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class AdminController {
    constructor(model, DataVersion) {
        this.model = model;
        this.CheckExercise = model.CheckExercise;
        this.StudyExercise = model.StudyExercise;
        this.RepetitionExercise = model.RepetitionExercise;
        this.DataVersion = DataVersion;
    }
    async addTask(req, res) {
        const { task, answer, hint, topic_id, type } = req.body;
        const token = req.cookies?.access_token;
        if (!token) return res.status(401).json({ message: "Токен отсутвует" });

        const t = await sequelize.transaction();
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_SECRET);
            if (decoded.role !== "admin") {
                return res.status(403).json({ message: "У вас недостаточно прав" });
            }
            if (type === "study") {
                await this.StudyExercise.create(
                    {
                        task: task,
                        answer: answer,
                        hint: hint,
                        topic_id: topic_id,
                    },
                    {
                        transaction: t,
                    }
                );
                await this.DataVersion.create(
                    {
                        user_id: decoded.id,
                        created_at: new Date(),
                        timestamp: new Date().getTime(),
                    },
                    {
                        transaction: t,
                    }
                );
                await t.commit();
                return res.status(201).json({ message: "Задание добавлено" });
            } else if (type === "check") {
                await this.CheckExercise.create(
                    {
                        task: task,
                        answer: answer,
                        hint: hint,
                        topic_id: topic_id,
                    },
                    {
                        transaction: t,
                    }
                );
                await this.DataVersion.create(
                    {
                        user_id: decoded.id,
                        created_at: new Date(),
                        timestamp: new Date().getTime(),
                    },
                    {
                        transaction: t,
                    }
                );
                await t.commit();
                return res.status(201).json({ message: "Задание добавлено" });
            } else if (type === "repetition") {
                await this.RepetitionExercise.create(
                    {
                        task: task,
                        answer: answer,
                        hint: hint,
                        topic_id: topic_id,
                    },
                    {
                        transaction: t,
                    }
                );
                await this.DataVersion.create(
                    {
                        user_id: decoded.id,
                        created_at: new Date(),
                        timestamp: new Date().getTime(),
                    },
                    {
                        transaction: t,
                    }
                );
                await t.commit();
                return res.status(201).json({ message: "Задание добавлено" });
            }
            return res.status(400).json({ message: "Неверные данные" });
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async editTask(req, res) {
        const { task, answer, hint, id, type } = req.body;
        const token = req.cookies?.access_token;
        if (!token) return res.status(401).json({ message: "Токен отсутвует" });
        const t = await sequelize.transaction();
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_SECRET);
            if (decoded.role !== "admin") {
                return res.status(403).json({ message: "У вас недостаточно прав" });
            }
            if (type === "study") {
                await this.StudyExercise.update(
                    {
                        task: task,
                        answer: answer,
                        hint: hint,
                    },
                    {
                        where: { id: id },
                        transaction: t,
                    }
                );
                await this.DataVersion.create(
                    {
                        user_id: decoded.id,
                        created_at: new Date(),
                        timestamp: new Date().getTime(),
                    },
                    {
                        transaction: t,
                    }
                );
                await t.commit();
                return res.status(201).json({ message: "Задание обновлено" });
            } else if (type === "check") {
                await this.CheckExercise.update(
                    {
                        task: task,
                        answer: answer,
                        hint: hint,
                    },
                    {
                        where: { id: id },
                        transaction: t,
                    }
                );
                await this.DataVersion.create(
                    {
                        user_id: decoded.id,
                        created_at: new Date(),
                        timestamp: new Date().getTime(),
                    },
                    {
                        transaction: t,
                    }
                );
                await t.commit();
                return res.status(201).json({ message: "Задание обновлено" });
            } else if (type === "repetition") {
                await this.RepetitionExercise.update(
                    {
                        task: task,
                        answer: answer,
                        hint: hint,
                    },
                    {
                        where: { id: id },
                        transaction: t,
                    }
                );
                await this.DataVersion.create(
                    {
                        user_id: decoded.id,
                        created_at: new Date(),
                        timestamp: new Date().getTime(),
                    },
                    {
                        transaction: t,
                    }
                );
                await t.commit();
                return res.status(201).json({ message: "Задание обновлено" });
            }
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async deleteTask(req, res) {
        const { id, type } = req.body;
        const token = req.cookies?.access_token;
        if (!token) return res.status(401).json({ message: "Токен отсутвует" });
        const t = await sequelize.transaction();
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_SECRET);
            if (decoded.role !== "admin") {
                return res.status(403).json({ message: "У вас недостаточно прав" });
            }
            if (type === "study") {
                await this.StudyExercise.destroy({
                    where: { id: id },
                    transaction: t,
                });
                await this.DataVersion.create(
                    {
                        user_id: decoded.id,
                        created_at: new Date(),
                        timestamp: new Date().getTime(),
                    },
                    {
                        transaction: t,
                    }
                );
                await t.commit();
                return res.status(201).json({ message: "Задание обновлено" });
            } else if (type === "check") {
                await this.CheckExercise.destroy({
                    where: { id: id },
                    transaction: t,
                });
                await this.DataVersion.create(
                    {
                        user_id: decoded.id,
                        created_at: new Date(),
                        timestamp: new Date().getTime(),
                    },
                    {
                        transaction: t,
                    }
                );
                await t.commit();
                return res.status(201).json({ message: "Задание обновлено" });
            } else if (type === "repetition") {
                await this.RepetitionExercise.destroy({
                    where: { id: id },
                    transaction: t,
                });
                await this.DataVersion.create(
                    {
                        user_id: decoded.id,
                        created_at: new Date(),
                        timestamp: new Date().getTime(),
                    },
                    {
                        transaction: t,
                    }
                );
                await t.commit();
                return res.status(201).json({ message: "Задание обновлено" });
            }
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async deleteOtherEntites(req, res) {
        const { id } = req.body;
        const token = req.cookies?.access_token;
        if (!token) return res.status(401).json({ message: "Токен отсутвует" });
        const t = await sequelize.transaction();
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_SECRET);
            if (decoded.role !== "admin") {
                return res.status(403).json({ message: "У вас недостаточно прав" });
            }
            await this.model.destroy({
                where: { id: id },
                transaction: t,
            });
            await this.DataVersion.create(
                {
                    user_id: decoded.id,
                    created_at: new Date(),
                    timestamp: new Date().getTime(),
                },
                {
                    transaction: t,
                }
            );
            await t.commit();
            return res.status(201).json({ message: "Deleted successfully" });
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async addOtherEntites(req, res) {
        const { title } = req.body;
        const token = req.cookies?.access_token;
        if (!token) return res.status(401).json({ message: "Токен отсутвует" });
        const t = await sequelize.transaction();
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_SECRET);
            if (decoded.role !== "admin") {
                return res.status(403).json({ message: "У вас недостаточно прав" });
            }
            await this.model.create(
                {
                    title: title,
                },
                {
                    transaction: t,
                }
            );
            await this.DataVersion.create(
                {
                    user_id: decoded.id,
                    created_at: new Date(),
                    timestamp: new Date().getTime(),
                },
                {
                    transaction: t,
                }
            );
            await t.commit();
            return res.status(201).json({ message: "Successfully added" });
        } catch (error) {
            await t.rollback();
            console.error("Error while adding tag:", error);
            throw error;
        }
    }
    async addTopic(req, res) {
        const { title, block_id } = req.body;
        const token = req.cookies?.access_token;
        if (!token) return res.status(401).json({ message: "Токен отсутвует" });
        const t = await sequelize.transaction();
        let decoded;
        try {
            console.log("title:", title, "block_id:", block_id);
            decoded = jwt.verify(token, process.env.ACCESS_SECRET);
            if (decoded.role !== "admin") {
                return res.status(403).json({ message: "У вас недостаточно прав" });
            }

            await this.model.create(
                {
                    title: title,
                    block_id: Number(block_id),
                },
                {
                    transaction: t,
                }
            );
            await this.DataVersion.create(
                {
                    user_id: decoded.id,
                    created_at: new Date(),
                    timestamp: new Date().getTime(),
                },
                {
                    transaction: t,
                }
            );
            await t.commit();
            return res.status(201).json({ message: "Successfully added" });
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async updateOtherentites(req, res) {
        const { id, title } = req.body;
        const token = req.cookies?.access_token;
        if (!token) return res.status(401).json({ message: "Токен отсутвует" });
        const t = await sequelize.transaction();
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_SECRET);
            if (decoded.role !== "admin") {
                return res.status(403).json({ message: "У вас недостаточно прав" });
            }
            await this.model.update(
                {
                    title: title,
                },
                {
                    where: { id: id },
                    transaction: t,
                }
            );
            await this.DataVersion.create(
                {
                    user_id: decoded.id,
                    created_at: new Date(),
                    timestamp: new Date().getTime(),
                },
                {
                    transaction: t,
                }
            );
            await t.commit();
            return res.status(201).json({ message: "Successfully added" });
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async connectTagWithTopic(req, res) {
        const { tag_id, topic_id } = req.body;
        const token = req.cookies?.access_token;
        if (!token) return res.status(401).json({ message: "Токен отсутвует" });
        const t = await sequelize.transaction();
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_SECRET);
            if (decoded.role !== "admin") {
                return res.status(403).json({ message: "У вас недостаточно прав" });
            }
            await this.model.create(
                {
                    tag_id: tag_id,
                    topic_id: topic_id,
                },
                {
                    transaction: t,
                }
            );
            await this.DataVersion.create(
                {
                    user_id: decoded.id,
                    created_at: new Date(),
                    timestamp: new Date().getTime(),
                },
                {
                    transaction: t,
                }
            );
            await t.commit();
            return res.status(201).json({ message: "Successfully сonnected" });
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async getUsers(req, res) {
        const token = req.cookies?.access_token;
        if (!token) return res.status(401).json({ message: "Токен отсутвует" });
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_SECRET);
            if (decoded.role !== "admin") {
                return res.status(403).json({ message: "У вас недостаточно прав" });
            }
            const users = await this.model.findAll({
                attributes: ["id", "username", "role"],
            });
            return res.status(201).json(users);
        } catch (error) {
            throw error;
        }
    }
    async ediUserRole(req, res) {
        const { id, role } = req.body;
        const t = await sequelize.transaction();
        const token = req.cookies?.access_token;
        if (!token) return res.status(401).json({ message: "Токен отсутвует" });
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_SECRET);
            if (decoded.role !== "admin") {
                return res.status(403).json({ message: "У вас недостаточно прав" });
            }
            await this.model.update(
                {
                    role: role,
                },
                {
                    where: {
                        id: id,
                    },
                    transaction: t,
                }
            );
            await t.commit();
            return res.status(201).json({ message: "Операция совершена успешно" });
        } catch (error) {
            await t.rollback();
            console.error(error);
            return res.status(500).json({ error: error.name });
        }
    }
}
