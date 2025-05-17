import { Router } from "express";
import { getUserProfile } from "../controllers/userProfile.controller.js";

const router = Router();

router.route('/profile/:userName')
    .get(getUserProfile)

export default router;