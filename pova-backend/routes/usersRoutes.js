import { Router } from "express";
import UserController from "../controllers/UserController.js";

const usersRouter = Router();

usersRouter.get('/me', UserController.fetchMe);
usersRouter.put('/me', UserController.updateMe);
usersRouter.delete('/me', UserController.deleteMe);
usersRouter.get('/:userId', UserController.fetchUser);
//usersRouter.get('/users/:userid/posts', UserController.fetchUserPosts);
export default usersRouter;
