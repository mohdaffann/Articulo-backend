import mongoose, { Schema, Types } from "mongoose";
import { User } from "./user.model.js";

const blogSchema = new Schema({
    blogName: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})

export const Blog = mongoose.model("Blog", blogSchema)