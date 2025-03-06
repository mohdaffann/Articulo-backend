import { Blog } from "../models/blog.model.js"
import { User } from "../models/user.model.js"

export const accessToModify = async (req, res, next) => {
    try {
        const userId = req.user._id
        const { id } = req.params
        const blog = await Blog.findById(id)

        if (!blog)
            return res.status(400).json({ message: "Blog not found" })

        if (blog.user.toString() !== userId)
            return res.status(400).json({ message: "ACCESS DENIED , CAN ONLY MODIFY YOUR BLOGS" })

        next()
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "SERVER ERROR" })
    }
}