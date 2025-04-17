import { Follow } from "../models/follow.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
export const followUser = async (req, res) => {
    try {

        const userID = req.user._id;

        const existUser = await User.findById(userID);
        if (!existUser) return res.status(400).json({ message: 'User does not exists' })
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'not a valid id of user you want to follow' })
        const providedId = await User.findById(id)
        if (!providedId) return res.status(400).json({ message: "Invalid id of user you want to follow" })
        if (userID === id) return res.status(400).json({ message: 'cannot follow yourself!' })
        const followInstance = new Follow(
            {
                follower: userID,
                following: providedId
            })
        await followInstance.save();
        const currentFollowing = await Follow.find({ follower: userID }).populate("following", 'userName')
        return res.status(201).json({ message: 'followed successfully', currentFollowing })
    } catch (error) {
        if (error.code === 11000)
            return res.status(409).json({ message: 'user already follows ' })
    }
}

const getFollowingList = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'invlid id of user of whos following list yo want to view' })
        const followingList = await Follow.find({ follower: id }).populate("following", 'userName')
        if (!followingList) return res.status(400).json({ message: 'user doesnt follow anyone' })
        return res.status(200).json({ message: 'list of followers fetched successful', followingList })
    } catch (error) {
        return res.status(500).json({ message: 'server error' })
    }
}
const getFollowerList = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'invlid id of user of whos following list yo want to view' })
        const followerList = await Follow.find({ following: id }).populate("follower", 'userName')
        if (!followerList) return res.status(400).json({ message: 'user doesnt follow anyone' })
        return res.status(200).json({ message: 'list of followers fetched successful', followerList })
    } catch (error) {
        return res.status(500).json({ message: 'server error' })
    }
}
export const getCurrentUserFollowing = async (req, res) => {
    try {
        const userId = req.user._id;
        const getFollowing = await Follow.find({ follower: userId }).populate("following", 'userName')
        if (!getFollowing) return res.status(400).json({ message: 'user doesnt follow anyone' })
        return res.status(200).json({ message: 'successful fetch', getFollowing })
    } catch (error) {
        return res.status(500).json({ message: 'server error' })
    }
}
export const getCurrentUserFollowers = async (req, res) => {
    try {
        const userId = req.user._id;
        const getFollowers = await Follow.find({ following: userId }).populate("follower", 'userName')
        if (!getFollowers) return res.status(400).json({ message: 'user doesnt have any followers' })
        return res.status(200).json({ message: 'successful fetch', getFollowers })
    } catch (error) {
        return res.status(500).json({ message: 'server error' })
    }
}

