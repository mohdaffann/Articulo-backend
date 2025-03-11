import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        required: true,
        type: String,

    },
    fullName: {
        type: String,
        required: [true, "fullname is required"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    profile: {
        type: String
    }
},
    {
        timestamps: true
    })


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.userName = this.userName.toLowerCase()
    this.email = this.email.toLowerCase()
    this.password = await bcrypt.hash(this.password, 10)
    next()
}
)
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        userName: this.userName,
        fullName: this.fullName,
        email: this.email,
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)


