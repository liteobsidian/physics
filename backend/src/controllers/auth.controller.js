import { where } from "sequelize";
import { sequelize } from "../config/db.js";
import { hashPassword, isPasswordMatch } from "../utils/passwordHasher.js";
import dotenv from "dotenv";
import { createAuthTokens } from "../middlewares/auth.middleware.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";
import e from "cors";
import { tr } from "vuetify/locale";
dotenv.config();

export class AuthController {
    constructor(model) {
        this.model = model;
    }
    async registerUser(req, res) {
        const t = await sequelize.transaction();
        const { username, password, email } = req.body;
        let committed = false;
        try {
            if (!username || !password || !email) {
                await t.rollback();
                return res.status(400).json({ message: "не все поля заполнены" });
            }

            const user = await this.model.create(
                {
                    username: username,
                    password: await hashPassword(password),
                    email: email,
                },
                {
                    transaction: t,
                }
            );

            await t.commit();
            committed = true;

            await sendEmail(email, username, user.id);

            return res.status(200).json({ message: "Пользователь зарегистрирован" });
        } catch (error) {
            if (committed === false) {
                await t.rollback();
            }
            console.error(error);
            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ message: "Такой пользователь уже существует!" });
            }
            return res.status(500).json({ message: "Ошибка регистрации" });
        }
    }

    async confirmRegister(req, res) {
        const verify_token = req.params.token;
        const t = await sequelize.transaction();
        try {
            const decoded = jwt.verify(verify_token, process.env.MAIL_SECRET);

            if (!decoded || !decoded.id) {
                return res.sendStatus(403);
            }

            await this.model.update(
                {
                    verified: true,
                },
                {
                    where: {
                        id: decoded.id,
                    },
                    transaction: t,
                }
            );

            await t.commit();
            res.redirect("http://localhost:5173/physics/#/login");
        } catch (error) {
            await t.rollback();
            console.error(error);
            return res.status(500).send("Ошибка верификации");
        }
    }

    async loginUser(req, res) {
        const t = await sequelize.transaction();
        try {
            const { email, password } = req.body;

            const user = await this.model.findOne({
                where: {
                    email: email,
                },
            });

            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }

            if (user.verified === false) {
                return res.status(401).json({ message: "Аккаунт не подтверждён" });
            }

            if (await isPasswordMatch(password, user.password)) {
                const tokens = await createAuthTokens(user.id, user.login);

                // await this.model.create(
                //     {
                //         refresh_token: tokens.refreshToken,
                //     },
                //     { transaction: t }
                // );

                res.cookie("access_token", tokens.accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                    maxAge: 15 * 60 * 1000,
                });

                res.cookie("refresh_token", tokens.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                });

                await t.commit();
                return res.status(200).json({
                    message: "Успешный вход!",
                });
            } else {
                await t.rollback();
                return res.status(401).json({ message: "Неверный пароль" });
            }
        } catch (error) {
            await t.rollback();
            console.error("Ошибка входа:", error);
            return res.status(500).json({ message: "Ошибка входа" });
        }
    }

    async logOut(req, res) {
        const access_token = req.cookies?.access_token;
        const refresh_token = req.cookies?.refresh_token;
        const t = await sequelize.transaction();

        if (!access_token || !refresh_token) {
            return res.status(404).json({ message: "Токены не найдены" });
        }

        try {
            await this.model.destroy({
                where,
            });
            res.clearCookie("access_token", { httpOnly: true, secure: false, sameSite: "strict" });
            res.clearCookie("refresh_token", { httpOnly: true, secure: false, sameSite: "strict" });

            return res.status(200).json({ message: "Токены удалены" });
        } catch (err) {
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }
}
