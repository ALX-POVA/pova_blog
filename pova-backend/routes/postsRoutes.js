import { Router } from "express";
import BlogPostController from "../controllers/BlogPostController.js";
import CommentController from "../controllers/CommentsController.js";
import { authorizeUser } from "../middlewares/tokenAuth.js";

const postsRouter = Router();

// posts operation endpoints

postsRouter.get('/popular', BlogPostController.getPopularPosts);
postsRouter.post('/', authorizeUser, BlogPostController.createPost);
postsRouter.get('/search', BlogPostController.searchPostByCategory);
postsRouter.post('/:postId/publish', authorizeUser, BlogPostController.publishPost);
postsRouter.delete('/:postId/publish', authorizeUser, BlogPostController.unPublishPost)
postsRouter.post('/:postId/comments', authorizeUser, CommentController.postComment);
postsRouter.delete('/:postId/comments/:commentId', authorizeUser, CommentController.deleteComment);
postsRouter.post('/:postId/like', authorizeUser, BlogPostController.likePost);
postsRouter.delete('/:postId/like', authorizeUser, BlogPostController.unlikePost);
postsRouter.get('/:postId', BlogPostController.fetchPost);
postsRouter.put('/:postId', authorizeUser, BlogPostController.updatePostData);
postsRouter.delete('/:postId', authorizeUser, BlogPostController.delPost);


export default postsRouter;
