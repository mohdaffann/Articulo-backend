import { Router } from "express";
import { loginUser, registerUser, logoutUser, updateUser, im, getUsers } from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { upload } from '../utils/multer.config.js';
import { followUser } from "../controllers/follow.controller.js";
const router = Router();

router.route('/register')
    .post(upload.single('profile'), registerUser)
router.route('/login')
    .post(loginUser)
router.route('/logout')
    .post(authenticateUser, logoutUser)
router.route('/updateDetails')
    .patch(authenticateUser, upload.single('profile'), updateUser)
router.route('/follow/:id')
    .post(authenticateUser, followUser)
router.route('/im')
    .get(authenticateUser, im)
router.route('/get')
    .get(getUsers);

export default router