import { User } from "../models/user.model.js";
import cookieParser from "cookie-parser";

const registerUser = async (req, res) => {
    try {

        const { userName, password, fullName, email } = req.body;
        if ([userName, password, fullName, email].some(field => field?.trim() === '')) {
            return res.status(400).json({ message: "All the fields are required" })
        }
        const existedUser = await User.findOne({
            $or: [{ userName }, { email }]
        })

        if (existedUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const user = new User({
            userName,
            fullName,
            email,
            password
        })

        await user.save()
        const token = user.generateAccessToken()

        const createdUser = await User.findById(user._id).select("-password")

        if (!createdUser) return res.status(401).json({ message: "User creation error" })

        res.status(201).json({
            token,
            createdUser
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "server error" })
    }
}

const loginUser = async (req, res) => {
    try {
        let { userName, password, email } = req.body

        if ([userName, password, email].some(field => field?.trim() === ''))
            return res.status(401).json({ message: "All fields are required" })

        userName = userName.toLowerCase()
        email = email.toLowerCase()

        const user = await User.findOne({
            $and: [{ userName }, { email }]
        })
        if (!user) return res.status(401).json({ message: "cannot find user" })

        const isMatch = await user.isPasswordCorrect(password)
        if (!isMatch)
            return res.status(401).json({ message: "Invalid Credentials!" })

        const token = user.generateAccessToken()

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only HTTPS in production
            sameSite: "Strict", // Prevents CSRF attacks
            maxAge: 24 * 60 * 60 * 1000 // 1 day expiry
        })

        const currentUser = await User.findById(user._id).select("-password")

        res.status(200).json({ message: "login successful", currentUser })

    }
    catch (error) {
        res.status(500).json({ message: "Server error" })
        console.log(error)
    }

}

export { registerUser, loginUser }