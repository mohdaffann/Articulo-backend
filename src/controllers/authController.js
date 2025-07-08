import { User } from "../models/user.model.js";
import cookieParser from "cookie-parser";
import { uploadCloudinary } from "../utils/cloudinary.config.js";

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

        let profileUrl = '';
        if (req.file) {
            try {
                const result = await uploadCloudinary(req.file.path);
                if (result) {
                    profileUrl = result.url;


                }
            } catch (uploadError) {
                console.error('upload failed', uploadError)
                return res.status(500).json({ message: 'cloudinary file upload failed' })
            }
        }

        const user = new User({
            userName,
            fullName,
            email,
            password,
            profile: profileUrl
        })

        await user.save()
        const token = user.generateAccessToken()

        const createdUser = await User.findById(user._id).select("-password")

        if (!createdUser) return res.status(401).json({ message: "User creation error" })
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(201).json({
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
            sameSite: "none", // Prevents CSRF attacks
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
        console.log('req data inside update controller', req.body);

        const userId = req.user._id
        const user = await User.findById(userId)
        if (email && email.trim() === '') return res.status(400).json({ message: 'email cannot be empty' })
        if (userName && userName.trim() === '') return res.status(400).json({ message: 'userName cannot be empty' })
        if (password && password.trim() === '') return res.status(400).json({ message: 'password cannot be empty' })
        if (fullName && fullName.trim() === '') return res.status(400).json({ message: 'fullname cannot be empty' })

        if (email && email === user.email) {
            return res.status(404).json({ message: 'Email cannot be the same!!' })
        }
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
        if (req.file) {
            try {
                const result = await uploadCloudinary(req.file.path);
                if (result) {
                    user.profile = result.url;
                }
            } catch (error) {
                console.log('error in uploading via cloudinary', error);
                return res.status(500).json({ message: 'Cloudinary upload failed , Try Again!!' })

            }
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


    } catch (error) {
        res.status(500).json({ message: 'internal server error ' })
    }

}

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -createdAt -updatedAt -email -fullName');
        return res.status(200).json({ message: 'Fetched all users successfully', users })

    } catch (error) {
        console.log('error fetching all users', error);
        return res.status(500).json({ message: 'internal server error' })

    }
}


export { registerUser, loginUser, logoutUser, updateUser, im, getUsers }