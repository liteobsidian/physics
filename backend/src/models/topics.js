"use strict";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class Topic extends Model {}

Topic.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.TEXT,
        },
        block_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tag_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "topics",
    }
);
