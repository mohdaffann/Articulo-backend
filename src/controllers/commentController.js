import { Comments } from "../models/comment.model.js";

export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (text.trim() === '')
            return res.status(400).json({ message: 'All fields are not fetched correctly' })
        const comment = new Comments({
            blogId: req.params.id,
            text,
            userId: req.user._id
        })

        await comment.save();
        return res.status(200).json({
            success: true,
            message: 'comment successfully added!',
            comment
        })
    } catch (error) {
        console.log('error in addComment', addComment);
        return res.status(500).json({ message: 'internal server error:', error })
    }
}
export const getComments = async (req, res) => {
    try {
        const comments = await Comments.find({ blogId: req.params.id }).populate('userId', '-password -email -fullName -createdAt -updatedAt')
        if (!comments) return res.status(400).json({ message: 'cannot find any comments', success: false })
        return res.status(200).json({ success: true, comments });
    } catch (error) {
        console.log('internal server error in fetching comments', error);
        return res.status(500).json({ success: false, message: 'server error in getting all comments ' })

    }
}