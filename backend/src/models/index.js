"use strict";
import { Block } from "./study-models/blocks.js";
import { Tag } from "./study-models/tags.js";
import { Topic } from "./study-models/topics.js";
import { StudyExercise, CheckExercise, RepetitionExercise } from "./study-models/exercises.js";
import { TopicTag } from "./study-models/topicTags.js";
import { User } from "./user-models/user.js";
import { UserProgress } from "./user-models/userprogress.js";
import { DataVersion } from "./study-models/dataVersion.js";
import { RecoveryCodes } from "./user-models/recovery_codes.js";

Block.hasMany(Topic, { foreignKey: "block_id" });
Topic.belongsTo(Block, { foreignKey: "block_id", as: "block" });

Topic.hasMany(StudyExercise, { foreignKey: "topic_id" });
StudyExercise.belongsTo(Topic, { foreignKey: "topic_id", as: "topic" });

Topic.hasMany(CheckExercise, { foreignKey: "topic_id" });
CheckExercise.belongsTo(Topic, { foreignKey: "topic_id", as: "topic" });

Topic.hasMany(RepetitionExercise, { foreignKey: "topic_id" });
RepetitionExercise.belongsTo(Topic, { foreignKey: "topic_id", as: "topic" });

User.hasMany(UserProgress, { foreignKey: "user_id" });
UserProgress.belongsTo(User, { foreignKey: "user_id", as: "user" });

Topic.belongsToMany(Tag, {
    through: TopicTag,
    foreignKey: "topic_id",
    otherKey: "tag_id",
});
Tag.belongsToMany(Topic, {
    through: TopicTag,
    foreignKey: "tag_id",
    otherKey: "topic_id",
});

User.hasMany(DataVersion, { foreignKey: "user_id" });
DataVersion.belongsTo(User, { foreignKey: "user_id", as: "user" });

User.hasMany(RecoveryCodes, { foreignKey: "user_id" });
RecoveryCodes.belongsTo(User, { foreignKey: "user_id", as: "user" });

export { Topic, Block, Tag, TopicTag, StudyExercise, CheckExercise, RepetitionExercise, User, UserProgress, DataVersion, RecoveryCodes };
