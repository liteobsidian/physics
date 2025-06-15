"use strict";
import { Block } from "./blocks";
import { Tag } from "./tags";
import { Topic } from "./topics";
import { Exercise } from "./exercises";

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
