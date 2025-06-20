"use strict";
import { Block } from "./blocks.js";
import { Tag } from "./tags.js";
import { Topic } from "./topics.js";
import { Exercise } from "./exercises.js";

Block.hasMany(Topic, {
    foreignKey: "block_id",
});

Tag.hasMany(Topic, {
    foreignKey: "tag_id",
});

Topic.hasMany(Exercise, {
    foreignKey: "topic_id",
});

export default {
    Topic,
    Block,
    Tag,
    Exercise,
};
