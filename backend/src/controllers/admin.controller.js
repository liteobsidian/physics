import { sequelize } from "../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class AdminController {
  constructor(model) {
    this.model = model;
    this.CheckExercise = model.CheckExercise;
    this.StudyExercise = model.StudyExercise;
    this.RepetitionExercise = model.RepetitionExercise;
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
      decoded = jwt.verify(token.process.env.ACCESS_SECRET);
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
        await t.commit();
        return res.status(201).json({ message: "Задание обновлено" });
      }
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}
