import express from "express";
const app = express();
import { sequelize } from "./src/config/db.js";

const port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

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
