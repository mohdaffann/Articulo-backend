import { Router } from "express";
import { loginUser, registerUser, logoutUser, updateUser } from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { upload } from '../utils/multer.config.js';

const router = Router();

router.route('/register')
    .post(upload.single('profile'), registerUser)
router.route('/login')
    .post(loginUser)
router.route('/logout')
    .post(authenticateUser, logoutUser)
router.route('/updateDetails')
    .post(authenticateUser, updateUser)

export default router