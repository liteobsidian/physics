"use strict";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

export class Tag extends Model {}

Tag.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        tableName: "tags",
    }
);
