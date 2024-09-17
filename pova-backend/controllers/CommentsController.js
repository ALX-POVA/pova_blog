// controllers/CommentController.js

import { db } from '../config/db.js';
import { getPost } from '../models/blog.js';
import { getUser } from '../models/user.js'; // Assuming you have a getUser function
import { authorizeUser } from '../middlewares/tokenAuth.js';
import { ObjectId } from 'mongodb';
import Joi from 'joi';

class CommentController {

    // Comment schema for validation
    commentSchema = Joi.object({
        content: Joi.string().required().messages({
            "string.empty": "Content cannot be empty",
        }),
        authorId: Joi.string().required().messages({
            "string.empty": "Author ID is required",
        }),
        postId: Joi.string().required().messages({
            "string.empty": "Post ID is required",
        })
    });

    static async postComment(req, res) {
        // Check if user is logged in
        const userId = await authorizeUser(req, res);
        const postId = req.params.postId;

        if (typeof userId !== 'string') return;

        try {
            // Check if user exists
            const user = await getUser({ _id: new ObjectId(userId) });
            if (!user) return res.status(401).json({ error: "User not found" });

            // Check if post exists
            const post = await getPost(postId);
            if (!post) return res.status(404).json({ error: "Post not found" });

            // Validate comment data
            const comment = {
                content: req.body.content,
                authorId: userId,
                postId
            };

            // const { error } = this.commentSchema.validate(comment);
            // if (error) return res.status(400).json({ error: error.details[0].message });

            // Create a new comment object
            const newComment = {
                _id: new ObjectId(),
                content: comment.content,
                authorId: userId,
                createdAt: new Date(),
            };

            // Append new comment using MongoDB's $push
            const result = await db.collection('BlogPosts')
                .updateOne({ _id: new ObjectId(postId) }, { $push: { comments: newComment } });

            if (result.modifiedCount > 0) {
                return res.status(201).json({ message: "Comment created successfully", comment: newComment });
            } else {
                return res.status(500).json({ error: "Failed to add comment" });
            }

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "An internal server error occurred" });
        }
    }

    static async deleteComment(req, res){
        // gets and verify user
        const userId = await authorizeUser(req, res);
        if (typeof userId !== 'string') return;

        try{
            // checks if post exists
            const postId = req.params.postId;
            const commentId = req.params.commentId
            const post = await getPost(postId);
            const user = await getUser({_id: new ObjectId(userId)});
            if (!user || post.authorId.toString() !== userId){
                return res.status(401).json({error: "Unauthorized"});
            }
            // 
            await db.collection('BlogPosts')
            .updateOne({_id: new ObjectId(postId)}, {
                $pull: {comments: new ObjectId(commentId)}
            });
        } catch (err){
            console.error(err);
            return res.status(500).json({error: "Internal server Error"});
        }
    }
}

export default CommentController;
