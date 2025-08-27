"use strict";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/db.js";

export class UserTokens extends Model {}

UserTokens.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
        },
        refresh_token: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        expires_at: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "usertokens",
    }
);
