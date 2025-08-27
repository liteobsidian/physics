import express from "express";
import cookieParser from "cookie-parser";
const app = express();
import { sequelize } from "./src/config/db.js";
import getDataRouter from "./src/routes/exercise.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.routes.js";
import adminRouter from "./src/routes/admin.routes.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const port = 5000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: "GET, POST, PUT, DELETE, OPTIONS",
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
        credentials: true,
    })
);

app.use("/data", getDataRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

try {
    await sequelize.authenticate();
    console.log("Подключение к БД успешно!");
} catch (error) {
    console.error("Ошибка при подключении к БД", error);
}

app.listen(port, () => {
    console.log(`Сервер работает на порту ${port}`);
});
