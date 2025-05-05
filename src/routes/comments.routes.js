import { Router } from 'express';
import { addComment, getComments } from '../controllers/commentController.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/blog/:id/comments')
    .post(authenticateUser, addComment)
    .get(getComments)

export default router;