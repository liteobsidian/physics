"use strict";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/db.js";

export class RecoveryCodes extends Model {}

RecoveryCodes.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        code: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.TIME,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "recovery_password_codes",
    }
);
