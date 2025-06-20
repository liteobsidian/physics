"use strict";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class Block extends Model {}

Block.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        tableName: "blocks",
    }
);
