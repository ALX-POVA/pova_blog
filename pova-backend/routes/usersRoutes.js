import { Router } from "express";
import UserController from "../controllers/UserController.js";
import BlogPostController from '../controllers/BlogPostController.js';

const usersRouter = Router();

usersRouter.get('/me', UserController.fetchMe);
usersRouter.put('/me', UserController.updateMe);
usersRouter.delete('/me', UserController.deleteMe);
usersRouter.get('/:userId', UserController.fetchUser);
usersRouter.get('/:userId/posts', BlogPostController.fetchUserPosts);
export default usersRouter;
