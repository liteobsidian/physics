"use strict";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class User extends Model {}

User.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
        progress: {
            type: DataTypes.TEXT,
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        role: {
            type: DataTypes.TEXT,
            defaultValue: "user",
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "users",
    }
);
