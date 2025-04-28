import { Router } from "express";
import { getBlog, getBlogById, updateBlog, postBlog, deleteBlog, uploadImageEditorjs } from "../controllers/blogController.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { accessToModify } from "../middlewares/updatedeleteaccess.middleware.js";
import { upload } from "../utils/multer.config.js";

const router = Router();

router.route('/blog')
    .get(getBlog)
    .post(authenticateUser, postBlog)

router.route('/blog/:id')
    .get(getBlogById)
    .put(authenticateUser, accessToModify, updateBlog)
    .delete(authenticateUser, accessToModify, deleteBlog)

router.route('/editorjs-image-upload')
    .post(authenticateUser, upload.single('file'), uploadImageEditorjs)

export default router