import { Router } from "express";
import BlogPostController from "../controllers/BlogPostController.js";

const postsRouter = Router();

// posts operation endpoints

//postsRouter.get('/popular');
postsRouter.post('/', BlogPostController.createPost);
postsRouter.get('/search', BlogPostController.searchPostByCategory);
postsRouter.get('/:postId', BlogPostController.fetchPost);
postsRouter.put('/:postId', BlogPostController.updatePostData);
postsRouter.delete('/:postId', BlogPostController.delPost);
postsRouter.post('/:postId/publish', BlogPostController.publishPost);

export default postsRouter;
