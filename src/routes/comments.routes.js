import { Router } from 'express';
import { addComment, getComments, updateComment, deleteComment } from '../controllers/commentController.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { modifyComments } from '../middlewares/modifyComments.middleware.js';
const router = Router();

router.route('/blog/comments/:id')
    .post(authenticateUser, addComment)
    .get(getComments)
router.route('/comment/:id')
    .patch(authenticateUser, modifyComments, updateComment)
    .delete(authenticateUser, modifyComments, deleteComment)
export default router;