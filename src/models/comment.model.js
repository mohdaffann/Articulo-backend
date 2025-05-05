import mongoose, { Schema } from "mongoose";
const commentSchema = new Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const Comments = mongoose.model('Comments', commentSchema);