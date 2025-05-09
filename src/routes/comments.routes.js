import { Router } from 'express';
import { addComment, getComments } from '../controllers/commentController.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/blog/comments/:id')
    .post(authenticateUser, addComment)
    .get(getComments)

export default router;