import { Blog } from "../models/blog.model.js";

export const getBlog = async (req, res) => {
    try {
        const blogs = await Blog.find()
        res.status(200).json({ message: "get created blogs", blogs })
    }
    catch (error) {
        res.status(400).send("error finding blogs")
        console.log(error);
    }
}

export const postBlog = async (req, res) => {
    try {

        const { blogName, title, description, category } = req.body;
        const blog = await Blog.create({
            blogName,
            title,
            description,
            category
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
        const blogById = await Blog.findById(req.params.id)
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