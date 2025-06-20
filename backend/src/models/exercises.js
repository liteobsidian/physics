"use strict";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class Exercise extends Model {}

Exercise.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    topic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    task: {
        type: DataTypes.TEXT,
    },
    answer: {
        type: DataTypes.TEXT,
    },
    hint: {
        type: DataTypes.TEXT,
    },
},{
    sequelize,
    tableName: "exercises"

}
);
