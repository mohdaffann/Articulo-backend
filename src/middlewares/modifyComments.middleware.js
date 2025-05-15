import { Comments } from "../models/comment.model.js";

export const modifyComments = async (req, res, next) => {
    try {
        const userId = req.user._id;
        console.log(userId);
        const { id } = req.params;
        console.log('params req :', req.params);

        const comment = await Comments.findById(id);
        console.log('comment by ID in access to modify middleware', comment);

        if (!comment) return res.status(404).json({ mesage: 'comment not found' })
        if (comment.userId.toString() === userId.toString()) {
            console.log('user loggined is the owner of comment');
            return next();
        }
        else {
            return res.status(400).json({ message: 'Access denied! Not the author of comment' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'error in catch of accessComments middleware' })
    }

}