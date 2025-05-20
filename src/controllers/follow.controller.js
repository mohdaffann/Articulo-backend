import { Follow } from "../models/follow.model.js";
import { User } from "../models/user.model.js";
import mongoose, { Mongoose } from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
export const followUser = async (req, res) => {
    try {

        const userID = req.user._id;

        const existUser = await User.findById(userID);
        if (!existUser) return res.status(400).json({ message: 'User does not exists' })
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ message: 'not a valid id of user you want to follow' })
        const providedId = await User.findById(id).select('-password -createdAt -updatedAt -email -fullName')
        if (!providedId) return res.status(400).json({ message: "Invalid id of user you want to follow" })
        if (userID.toString() === id) return res.status(400).json({ message: 'cannot follow yourself!' })
        const alreadyFollowing = await Follow.find({ follower: userID, following: id })
        if (alreadyFollowing.length > 0) return res.status(409).json({ message: 'Already following' })
        const followInstance = new Follow(
            {
                follower: userID,
                following: providedId
            })
        await followInstance.save();

        return res.status(201).json({ message: 'followed successfully', user: providedId })
    } catch (error) {
        return res.status(500).json({ message: 'internal server error' }, error)
    }
}

export const getFollowingList = async (req, res) => {
    try {
        const userID = req.params.id
        if (!isValidObjectId(userID)) return res.status(400).json({ message: 'invlid id of user of whos following list yo want to view' })
        const followingList = await Follow.find({ follower: userID }).populate("following", 'userName _id profile')
        if (!followingList) return res.status(400).json({ message: 'user doesnt follow anyone' })
        return res.status(200).json({ message: 'list of followers fetched successful', followingList })
    } catch (error) {
        return res.status(500).json({ message: 'server error' })
    }
}
export const getFollowerList = async (req, res) => {
    try {
        const userId = req.params.id
        console.log('inside followers controller', userId);

        if (!isValidObjectId(userId)) return res.status(400).json({ message: 'invlid id of user of whos following list yo want to view' })
        const followerList = await Follow.find({ following: userId }).populate("follower", 'userName profile')
        if (!followerList) return res.status(400).json({ message: 'user doesnt follow anyone' })
        return res.status(200).json({ message: 'list of followers fetched successful', followerList })
    } catch (error) {
        return res.status(500).json({ message: 'server error' })
    }
}

