// controllers/CommentController.js

import BlogModel from "../models/blog.js";
import UserModel from "../models/user.js";
import { ObjectId } from "mongodb";

class CommentController {
  /**
  * Asynchronous method to post a comment on a blog post.
  * 
  * @param {Object} req - The request object containing the current user ID and the post ID.
  * @param {Object} res - The response object to send back the result or error.
  * @returns {Object} - Returns a response status indicating the success or
  *                     failure of the comment posting process.
  */
  static async postComment(req, res) {
    // Check if user is logged in
    const userId = req.currentUserId;
    const postId = req.params.postId;

    if (typeof userId !== "string") return;

    try {
      // Check if user exists
      const user = await UserModel.getUser({ _id: new ObjectId(userId) });
      if (!user) return res.status(401).json({ error: "User not found" });

      // Check if post exists
      const post = await BlogModel.getPost(postId);
      if (!post) return res.status(404).json({ error: "Post not found" });

      // Validate comment data
      const comment = {
        content: req.body.content,
        authorId: userId,
        postId,
      };

      if (!comment.content)
        return res.status(400).json({error: "Comment content cannot be empty"});

      // Create a new comment object
      const newComment = {
        _id: new ObjectId(),
        content: comment.content,
        authorId: userId,
        createdAt: new Date(),
      };

      // Append new comment using MongoDB's $push
      const result = await BlogModel.addComment(postId, newComment);

      if (result) {
        return res
          .status(201)
          .json({
            message: "Comment created successfully",
            comment: newComment,
          });
      } else {
        return res.status(500).json({ error: "Could not post comment" });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "An internal server error occurred" });
    }
  }

  /**
   * Asynchronous method to delete a comment associated with a post.
   * 
   * @param {Object} req - The request object containing current user ID, post ID, and comment ID.
   * @param {Object} res - The response object to send back the result or error.
   * @returns {Object} - Returns a response status indicating the success or failure of the deletion process.
   */
  static async deleteComment(req, res) {
    // Get and verify user
    const userId = req.currentUserId;
    if (typeof userId !== "string") return;

    try {
      // Check if post exists
      const postId = req.params.postId;
      const commentId = req.params.commentId;

      // Find the post with the comment

      const result = await BlogModel.removeComment(postId, commentId);

      if (result.error) {
        return res.status(404).json(result);
      }

      if (!result) {
        return res.status(500).json({ error: "Failed to delete comment" });
      }

      return res.sendStatus(204);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default CommentController;
