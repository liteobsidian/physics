"use strict";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class Admin extends Model {}

Admin.init(
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
            unique: true,
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        tableName: "admins",
    }
);
