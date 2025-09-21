"use strict";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/db.js";

export class DataVersion extends Model {}

DataVersion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "data_version",
    }
);
