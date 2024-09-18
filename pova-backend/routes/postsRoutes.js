import { Router } from "express";
import BlogPostController from "../controllers/BlogPostController.js";
import CommentController from "../controllers/CommentsController.js";

const postsRouter = Router();

// posts operation endpoints

postsRouter.get('/drafts', BlogPostController.fetchMydrafts);
postsRouter.get('/popular', BlogPostController.getPopularPosts);
postsRouter.post('/', BlogPostController.createPost);
postsRouter.get('/search', BlogPostController.searchPostByCategory);
postsRouter.post('/:postId/publish', BlogPostController.publishPost);
postsRouter.post('/:postId/comments', CommentController.postComment);
postsRouter.delete('/:postId/comments/:commentId', CommentController.deleteComment);
postsRouter.post('/:postId/like', BlogPostController.likePost);
postsRouter.get('/:postId', BlogPostController.fetchPost);
postsRouter.put('/:postId', BlogPostController.updatePostData);
postsRouter.delete('/:postId', BlogPostController.delPost);


export default postsRouter;
