import { where } from "sequelize";
import { sequelize } from "../config/db.js";
import { hasher, isPasswordMatch } from "../utils/hasher.js";
import dotenv from "dotenv";
import { createAuthTokens } from "../middlewares/auth.middleware.js";
import { sendEmail, recoveryPasswordMailSendler } from "../services/mail.service.js";
import { generate_code } from "../utils/codeGenerator.js";
import jwt, { decode } from "jsonwebtoken";
dotenv.config();

export class AuthController {
    constructor(model) {
        this.model = model;
        this.RecoveryCodes = model.RecoveryCodes;
    }
    async registerUser(req, res) {
        const t = await sequelize.transaction();
        const { username, password, email } = req.body;
        let committed = false;
        try {
            const user = await this.model.create(
                {
                    username: username,
                    password: await hasher(password),
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
                return res.status(400).json({ message: "Такой пользователь уже существует!", error: error.name, errorDescription: error.original.constraint });
            }
            return res.status(500).json({ message: "Ошибка регистрации" });
        }
    }

    async confirmRegister(req, res) {
        const verify_token = req.params.token;
        const t = await sequelize.transaction();
        try {
            let decoded = jwt.verify(verify_token, process.env.MAIL_SECRET);

            if (!decoded || !decoded.id) {
                return res.sendStatus(401);
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
        let decoded;
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
                const tokens = await createAuthTokens(user.id, user.login, user.role);
                decoded = jwt.verify(tokens.refreshToken, process.env.REFRESH_SECRET);

                const loggined_at = new Date();
                await this.model.update(
                    {
                        session_start: loggined_at,
                    },
                    {
                        transaction: t,
                        where: {
                            id: user.id,
                        },
                    }
                );
                await t.commit();

                res.cookie("access_token", tokens.accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 15 * 60 * 1000,
                });

                res.cookie("refresh_token", tokens.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                });

                // await t.commit();
                return res.status(200).json({
                    message: "Успешный вход!",
                    token: decoded,
                    loggined_at: loggined_at,
                });
            } else {
                // await t.rollback();
                return res.status(400).json({ message: "Неверный пароль" });
            }
        } catch (error) {
            await t.rollback();
            console.error("Ошибка входа:", error);
            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(500).json({ message: "Вы уже вошли", error: error.name });
            }
            return res.status(500).json({ message: "Ошибка входа" });
        }
    }

    async logOut(req, res) {
        const access_token = req.cookies?.access_token;
        const refresh_token = req.cookies?.refresh_token;

        if (!access_token || !refresh_token) {
            return res.status(401).json({ message: "Токены не найдены" });
        }

        let decoded;
        try {
            decoded = jwt.verify(access_token, process.env.ACCESS_SECRET);
        } catch (err) {
            res.clearCookie("access_token", { httpOnly: true, secure: false, sameSite: "strict" });
            res.clearCookie("refresh_token", { httpOnly: true, secure: false, sameSite: "strict" });
            return res.status(401).json({ message: "Невалидный токен" });
        }

        const t = await sequelize.transaction();

        try {
            await this.model.update(
                {
                    session_end: new Date(),
                },
                {
                    transaction: t,
                    where: {
                        id: decoded.id,
                    },
                }
            );
            await t.commit();

            res.clearCookie("access_token", { httpOnly: true, secure: false, sameSite: "strict" });
            res.clearCookie("refresh_token", { httpOnly: true, secure: false, sameSite: "strict" });

            return res.status(200).json({ message: "Токены удалены" });
        } catch (err) {
            await t.rollback();
            console.log(err);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }
    async forgotPasswordMailSendler(req, res) {
        const email = req.body.email;
        const t = await sequelize.transaction();
        console.log(email);
        try {
            const user = await this.model.findOne({
                where: {
                    email: email,
                },
            });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const code = generate_code();
            const codeHash = hasher(code);
            const createdCodeTime = new Date();

            await this.RecoveryCodes.create(
                {
                    user_id: user.id,
                    code: codeHash,
                    created_at: createdCodeTime,
                },
                {
                    transaction: t,
                }
            );
            await t.commit();

            try {
                await recoveryPasswordMailSendler(email, user.username, code);
            } catch (mailErr) {
                console.error(mailErr);
            }
            return res.status(200).json({ message: "Success" });
        } catch (err) {
            await t.rollback();
            console.error(err);
            return res.status(500).json({ error: err.name });
        }
    }
    async recoveryPassword(req, res) {
        const newPassword = req.body;
        const verify_token = req.params.token;
        const t = await sequelize.transaction();
        try {
            let decoded = jwt.verify(verify_token, process.env.MAIL_SECRET);
            const hashedPassword = hasher(newPassword);

            const updatePassword = await this.model.update(
                {
                    password: hashedPassword,
                },
                {
                    where: {
                        id: decoded.id,
                    },
                    transaction: t,
                }
            );
            await t.commit();
            return res.status(200).json({ message: "Пароль успешно изменён" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.name });
        }
    }
}
