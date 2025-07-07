import dotenv from "dotenv";
dotenv.config()

import { v2 as cloudinary } from "cloudinary";
import commentRouter from './routes/comments.routes.js'
import express from "express";
import mongoose from "mongoose";
import blogRouter from './routes/blog.routes.js';
import userRouter from './routes/user.routes.js';
import followRouter from './routes/follow.routes.js'
import cookieParser from "cookie-parser";
import { Follow } from "./models/follow.model.js";
import userProfileRouter from './routes/userProfile.routes.js'
import cors from 'cors';

if (process.env.NODE_ENV === 'production') {
    console.log = () => { };
    console.error = () => { };
    console.warn = () => { };
    console.info = () => { };
    console.debug = () => { };
}


const app = express();
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://articulo.vercel.app'
    ],
    credentials: true
}))


async function connectDB() {
    try {
        await mongoose.connect(
            `${process.env.CONNECTION_INSTANCE}`
        )
        console.log('mongodb connected successfully')
        await Follow.syncIndexes();
    } catch (error) {
        console.log('mongo connect error', error)
    }
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

connectDB();

app.use('/api/v1', blogRouter);
app.use('/api/v1/auth', userRouter);
app.use('/api/v1', commentRouter)
app.use('/api/v1', userProfileRouter)
app.use('/api/v1', followRouter)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log('listening on port ')
})

export { cloudinary } 