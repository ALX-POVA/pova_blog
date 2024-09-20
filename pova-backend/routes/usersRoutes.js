import { Router } from "express";
import UserController from "../controllers/UserController.js";
import BlogPostController from '../controllers/BlogPostController.js';
import { authorizeUser } from "../middlewares/tokenAuth.js";
import upload from "../config/multer.js";

const usersRouter = Router();

usersRouter.get('/me', authorizeUser, UserController.fetchMe);
usersRouter.get('/me/posts', authorizeUser, BlogPostController.fetchUserPosts);
usersRouter.get('/me/drafts', authorizeUser, BlogPostController.fetchMydrafts);
usersRouter.put('/me', authorizeUser,UserController.updateMe);
usersRouter.delete('/me', authorizeUser, UserController.deleteMe);
usersRouter.get('/:userId', UserController.fetchUser);
usersRouter.get('/:userId/posts', BlogPostController.fetchUserPosts);
usersRouter.post(
    '/me/upload-profile-picture',
    authorizeUser,
    upload.single('profilePicture'),
    UserController.uploadProfilePic
);
export default usersRouter;
