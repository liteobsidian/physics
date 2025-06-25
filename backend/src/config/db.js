import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: "Z:/GitReps/physics/backend/.env" });

export const sequelize = new Sequelize({
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: console.log,
    define: {
        timestamps: false,
        underscored: false,
        // freezeTableName: false,
    },
});

console.log("DB_USER:", process.env.DB_USER);
