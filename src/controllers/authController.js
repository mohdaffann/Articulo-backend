import { User } from "../models/user.model.js";
import cookieParser from "cookie-parser";
import { uploadCloudinary } from "../utils/cloudinary.config.js";

const registerUser = async (req, res) => {
    try {

        const { userName, password, fullName, email, profile } = req.body;

        if ([userName, password, fullName, email].some(field => field?.trim() === '')) {
            return res.status(400).json({ message: "All the fields are required" })
        }
        const existedUser = await User.findOne({
            $or: [{ userName }, { email }]
        })

        if (existedUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const filepath = req.file?.path
        const result = filepath ? await uploadCloudinary(filepath) : { url: "" }



        const user = new User({
            userName,
            fullName,
            email,
            password,
            profile: result.url || ""
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
        let { password, email } = req.body

        if ([password, email].some(field => field?.trim() === ''))
            return res.status(401).json({ message: "All fields are required" })


        const user = await User.findOne({ email })
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
        console.log(error)
        res.status(500).json({ message: "Server error" })
    }

}

const logoutUser = async (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
            .status(200)
            .json({ message: "User Logged Out!" })
    }
    catch (error) {
        res.status(500).json({ message: "cannot logout (server error) " })
    }
}

const updateUser = async (req, res) => {
    try {
        const { userName, email, password, fullName } = req.body;
        const userId = req.user._id
        const user = await User.findById(userId)
        if (email && email.trim() === '') return res.status(400).json({ message: 'email cannot be empty' })
        if (userName && userName.trim() === '') return res.status(400).json({ message: 'userName cannot be empty' })
        if (password && password.trim() === '') return res.status(400).json({ message: 'password cannot be empty' })
        if (fullName && fullName.trim() === '') return res.status(400).json({ message: 'fullname cannot be empty' })

        if (email && email !== user.email) {
            const existEmail = await User.findOne({ email })
            if (existEmail) return res.status(400).json({ message: "Email already exists" })
            user.email = email;
        }
        if (userName && userName !== user.userName) {
            const existUserName = await User.findOne({ userName })
            if (existUserName) return res.status(400).json({ message: "username already exists" })
            user.userName = userName;
        }

        if (fullName && fullName !== user.fullName) {
            user.fullName = fullName;
        }
        await user.save()
        const updatedUser = await User.findById(userId).select('-password')
        res.status(200).json({ message: 'update successful', updatedUser })

    } catch (error) {
        console.log('inside user update error console', error)
        res.status(500).json({ message: 'server error' })
    }
}

const im = async (req, res) => {
    try {
        const user = req.user
        if (!user) return res.status(401).json({ message: 'user not authenticated' })
        res.status(200).json({
            user
        })
        console.log(user);

    } catch (error) {
        res.status(500).json({ message: 'internal server error ' })
    }

}


export { registerUser, loginUser, logoutUser, updateUser, im }