"use strict";
import { Block } from "./blocks.js";
import { Tag } from "./tags.js";
import { Topic } from "./topics.js";
import { Exercise } from "./exercises.js";
import { TopicTag } from "./topicTags.js";

Block.hasMany(Topic, { foreignKey: "block_id" });
Topic.belongsTo(Block, { foreignKey: "block_id", as: "block" });

Topic.hasMany(Exercise, { foreignKey: "topic_id" });
Exercise.belongsTo(Topic, { foreignKey: "topic_id", as: "topic" });

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

export { Topic, Block, Tag, Exercise, TopicTag };
