import express from "express";
import cookieParser from "cookie-parser";
const app = express();
import { sequelize } from "./src/config/db.js";
import getDataRouter from "./src/routes/exercise.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.routes.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const port = 5000;

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: "GET, POST, PUT, DELETE, OPTIONS",
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true,
    })
);

app.use("/data", getDataRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

try {
    await sequelize.authenticate();
    console.log("Подключение к БД успешно!");
} catch (error) {
    console.error("Ошибка при подключении к БД", error);
}

app.listen(port, () => {
    console.log(`Сервер работает на порту ${port}`);
});
