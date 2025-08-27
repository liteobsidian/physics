"use strict";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/db.js";

export class StudyExercise extends Model {}
export class CheckExercise extends Model {}
export class RepetitionExercise extends Model {}

const commonFields = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
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
};

StudyExercise.init(commonFields, { sequelize, tableName: "study_exercises" });
CheckExercise.init(commonFields, { sequelize, tableName: "check_exercises" });
RepetitionExercise.init(commonFields, { sequelize, tableName: "repetition_exercises" });
