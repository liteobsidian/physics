"use strict";
import { Block } from "./blocks.js";
import { Tag } from "./tags.js";
import { Topic } from "./topics.js";
import { StudyExercise, CheckExercise, RepetitionExercise } from "./exercises.js";
import { TopicTag } from "./topicTags.js";
import { User } from "./user.js";
import { Admin } from "./admins.js";
import { UserProgress } from "./userprogress.js";

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

export { Topic, Block, Tag, TopicTag, StudyExercise, CheckExercise, RepetitionExercise, User, Admin, UserProgress };
