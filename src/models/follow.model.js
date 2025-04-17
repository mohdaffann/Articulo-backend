import mongoose, { Schema } from "mongoose";

const followSchema = new Schema(
    {

        follower: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },

        following: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }

    },
    {
        timestamps: true
    }
)
followSchema.index({ follower: 1, following: 1 }, { unique: true })

export const Follow = mongoose.model("Follow", followSchema)