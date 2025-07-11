import { Blog } from "../models/blog.model.js";
import { uploadCloudinary } from "../utils/cloudinary.config.js";



export const getBlog = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('user', '-password -email -fullName -createdAt -updatedAt')
        res.status(200).json({ message: "get created blogs", blogs })
    }
    catch (error) {
        res.status(400).send("error finding blogs")
        console.log(error);
    }
}

export const postBlog = async (req, res) => {
    try {

        const { title, description, category } = req.body;
        const blog = await Blog.create({

            title,
            description,
            category,
            user: req.user._id
        })
        res.status(200).json({ message: "Blog created successfully", blog })
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: 'error in creating the Blog' });
    }
}

export const updateBlog = async (req, res) => {
    try {
        const { blogName, title, description, category } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { blogName, title, description, category }, { new: true })
        res.status(200).json({ message: "Blog updated successfully", updatedBlog })
    }
    catch (error) {
        res.status(401).send("error finding and updating")
    }

}

export const getBlogById = async (req, res) => {

    try {
        const blogById = await Blog.findById(req.params.id).populate('user', '-password -email -fullName -createdAt -updatedAt')
        res.status(200).json({ message: "Blog by given ID found", blogById })
    }

    catch (error) {
        res.status(400).send("error in replacing")
    }
}

export const deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

        if (!deletedBlog) return res.status(404).json({ message: "Blog not found" });

        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting Blog", error });
    }
}

export const searchBlog = async (req, res) => {
    try {
        const searchParams = req.query.q;
        if (!searchParams || searchParams.trim() === '')
            return res.status(400).json({ message: 'search is empty!' })
        const blogs = await Blog.find({ title: { $regex: searchParams, $options: 'i' } }).select("-description -user")
        return res.status(200).json({ message: 'success', blogs })
    } catch (error) {
        console.log('error occured in search blog', error);
        return res.status(500).json({ message: 'error , try again!' })

    }
}

export const uploadImageEditorjs = async (req, res) => {
    try {
        console.log(' req file for editorjs image', req?.file);
        if (!req.file) {
            return res.status(400).json({
                success: 0,
                message: "No file uploaded (error in finding req.file)"
            });
        }
        try {
            const result = await uploadCloudinary(req.file.path);
            console.log(result);

            if (result && result.url) {
                return res.status(200).json({
                    success: 1,
                    file: {
                        url: result.secure_url,
                    }
                });
            }
        } catch (cloudError) {
            console.log('Cloudinary upload error:', cloudError);

            return res.status(500).json({
                success: 0,
                message: "Error uploading image to Cloudinary"
            });
        }

    } catch (error) {
        console.log('server error', error);
        return res.status(500).json({
            success: 0,
            message: 'internal server error'
        })

    }
}