import {Router} from 'express';
import authRouter from './authRoutes.js';
import BlogPostController from '../controllers/BlogPostController.js';
import usersRouter from './usersRoutes.js';



const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.get('/posts/drafts', BlogPostController.fetchMydrafts);

export default router;
