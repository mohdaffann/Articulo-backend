import { cloudinary } from "../index.js";
import fs from "fs";

const uploadCloudinary = async (loaclFilePath) => {
    try {
        console.log(loaclFilePath);
        console.log(cloudinary.config())
        if (!loaclFilePath) return null;
        const response = await cloudinary.uploader.upload(loaclFilePath, {
            resource_type: "auto",
        });
        //console.log("file uploaded successfully!", response.url);
        fs.unlinkSync(loaclFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(loaclFilePath);
        return null;
    }
};

export { uploadCloudinary };