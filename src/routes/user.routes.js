import { Router } from "express";
import { loginUser, registerUser, logoutUser } from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register')
    .post(registerUser)
router.route('/login')
    .post(loginUser)
router.route('/logout')
    .post(authenticateUser, logoutUser)

export default router