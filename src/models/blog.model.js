import mongoose, { Schema, Types } from "mongoose";
import { User } from "./user.model.js";

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,

    },
    description: {
        type: Object,
        required: true
    },

    category: {
        type: String,
        required: false,
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