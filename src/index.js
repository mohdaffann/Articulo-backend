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


const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://articulo.vercel.app'
    ],
    credentials: true
}))

if (process.env.NODE_ENV === 'production') {
    console.log = () => { };
    console.error = () => { };
    console.warn = () => { };
    console.info = () => { };
    console.debug = () => { };
}


app.use(cookieParser())
app.use(express.json())



async function connectDB() {
    try {
        await mongoose.connect(
            process.env.CONNECTION_INSTANCE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            bufferCommands: false,
            bufferMaxEntries: 0
        }
        );
        console.log('mongodb connected successfully')
        await Follow.syncIndexes();
    } catch (error) {
        console.log('mongo connect error', error)
        process.exit(1);
    }
}
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
});


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

app.get("/", (req, res) => {
    res.status(200).send('server is active')

});

app.get("/api/checkHealth", async (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    if (dbStatus !== "connected") {
        return res.status(503).json({ status: "error", db: dbStatus });
    }
    res.status(200).json({ status: "ok", db: dbStatus, timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log('listening on port ')
})

process.on("SIGTERM", () => {
    console.log('Inside Sigterm , Shutting Off');
    server.close(() => {
        mongoose.connection.close(() => {
            console.log('connection closed of db');
            process.exit(0);
        })
    })

})

export { cloudinary } 