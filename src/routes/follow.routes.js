import { Router } from "express";
import { followUser, getFollowerList, getFollowingList } from '../controllers/follow.controller.js';
import { authenticateUser } from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/follow/:id')
    .post(authenticateUser, followUser)
router.route('/followers/:id')
    .get(getFollowerList)
router.route('/following/:id')
    .get(getFollowingList)

export default router; 