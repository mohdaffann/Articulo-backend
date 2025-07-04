import mongoose, { Schema, Types } from "mongoose";
import { User } from "./user.model.js";

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: Object,
        required: true
    },

    category: {
        type: String,
        required: false,
        index: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    commentCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

blogSchema.index()

export const Blog = mongoose.model("Blog", blogSchema)