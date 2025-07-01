import express from "express";
const app = express();
import { sequelize } from "./src/config/db.js";
import getDataRouter from "./src/routes/exerciseRouter.js";
import cors from "cors";

const port = 5000;

app.use(express.json());

app.use(
    cors({
        host: "http://localhost:5000",
        origin: "http://localhost:5173",
        methods: "GET, POST, PUT, DELETE, OPTIONS",
        allowedHeaders: ["Authorization", "refresh_token", "Content-Type"],
        credentials: true,
    })
);

app.use("/data", getDataRouter);

try {
    await sequelize.authenticate();
    console.log("Подключение к БД успешно!");
} catch (error) {
    console.error("Ошибка при подключении к БД", error);
}

app.listen(port, (err) => {
    if (err) {
        console.error("Ошибка при запуске сервера:", err);
    } else {
        console.log(`Сервер работает на порту ${port}`);
    }
});
