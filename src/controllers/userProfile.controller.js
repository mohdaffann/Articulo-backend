import { Blog } from '../models/blog.model.js';
import { User } from '../models/user.model.js';

export const getUserProfile = async (req, res) => {
    try {
        const { userName } = req.params;
        const user = await User.findOne({ userName: userName }).select('-password -createdAt -updatedAt -fullName -email')
        if (!user) return res.status(404).json({ message: 'user not found' })
        const blogs = await Blog.find({ user: user._id }).populate('user', '-password -email -fullName -createdAt -updatedAt')
        if (!blogs) return res.status(404).json({ message: 'blogs not found' })
        return res.status(200).json({ user, blogs })

    } catch (error) {
        console.log('server error in profile controller', error);
        return res.status(500).json({ message: 'internal server error' })
    }
}