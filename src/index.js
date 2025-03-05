import express from "express";
import mongoose from "mongoose";
import blogRouter from './routes/blog.routes.js';
import userRouter from './routes/user.routes.js';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config({
    path: './.env'
}
)


const app = express();
app.use(cookieParser())
app.use(express.json())


async function connectDB() {
    await mongoose.connect(
        `${process.env.CONNECTION_INSTANCE}`
    )
        .then(() => {
            console.log('mongodb connected successfully')

        })
        .catch((error) => {
            console.log('error', error)
        })
}

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




app.listen(4000, () => {
    console.log('listening on port 4000')
}) 