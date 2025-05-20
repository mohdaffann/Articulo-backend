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


const app = express();
app.use(cookieParser())
app.use(express.json())


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
/* mongoose.connection.once("open", async () => {
   try {
       await mongoose.connection.db.dropCollection("recipes");
       console.log(" Collection 'recipes' dropped successfully");
   } catch (error) {
       console.error("⚠️ Error dropping collection:", error.message);
   }
});
*/
connectDB();

app.use('/api/v1', blogRouter);
app.use('/api/v1/auth', userRouter);
app.use('/api/v1', commentRouter)
app.use('/api/v1', userProfileRouter)
app.use('/api/v1', followRouter)


app.listen(4000, () => {
    console.log('listening on port 4000')
})

export { cloudinary } 