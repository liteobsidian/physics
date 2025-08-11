"use strict";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class UserProgress extends Model {}

UserProgress.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        exercise_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        exercise_type: {
            type: DataTypes.ENUM("study", "check", "repetition"),
            allowNull: false,
        },
        topic_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "userprogress",
    }
);
