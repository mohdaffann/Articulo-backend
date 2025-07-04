import { Router } from "express";
import { followUser, getFollowerList, getFollowingList, unfollowUser } from '../controllers/follow.controller.js';
import { authenticateUser } from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/follow/:id')
    .post(authenticateUser, followUser)
router.route('/followers/:id')
    .get(getFollowerList)
router.route('/following/:id')
    .get(getFollowingList)
router.route('/unfollow/:id')
    .delete(authenticateUser, unfollowUser)

export default router; 