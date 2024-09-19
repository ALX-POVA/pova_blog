// blog post controller
import { addPost, getPost, updatePost, deletePost, getDrafts } from "../models/blog.js";
import {db} from '../config/db.js'
import { ObjectId } from "mongodb";
import { authorizeUser } from "../middlewares/tokenAuth.js";
import { getUser } from "../models/user.js";


class BlogPostController{

    static async getPopularPosts(req, res) {
        try {
            // Fetch posts sorted by views in descending order
            const popularPosts = await db.collection('BlogPosts')
            .find()
            .sort({ views: -1 })  // Sort by 'views' in descending order
            .limit(10)            // Limit to top 10 posts
            .toArray();
            
            // Return the sorted posts
            return res.status(200).json(popularPosts);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "An error occurred while fetching popular posts." });
        }
    }

    static async fetchUserPosts(req, res){
        const userId = req.params.userId;
        try{
            const posts = await db.collection("BlogPosts")
            .find({authorId: new ObjectId(userId)})
            .toArray();
            return res.status(200).json(posts);
        } catch(err){
            console.error(err);
            return res.sendStatus(500);
        }
    }

    /**
     * fetches logged in user unpublished articles
     * @param {object} req - request object
     * @param {object} res - response object
     * @returns response
     */
    static async fetchMydrafts(req, res){
        // Check authorized user
        const userId = await authorizeUser(req, res);

        if (typeof userId !== 'string') return;

        const drafts = getDrafts(userId);
        if (drafts === null) return res.sendStatus(500);
        return res.status(200).json(drafts);
    }

    static async fetchPost(req, res){
        const postId = req.params.postId;

        const post = await getPost(postId);
        if (!post) return res.status(404).json({error: "Post not found"});
        await db.collection('BlogPosts').updateOne(
            { _id: new ObjectId(postId)},
            { $inc: { views: 1 } });
        return res.status(200).json(post);
    }
    /**
     * Updates a post's data after verifying the user's authorization.
     * Retrieves the post by ID and checks if the current user is the author.
     * If the post is not found, returns a 404 error response.
     * If the user is unauthorized, returns a 401 error response.
     * If the update is successful, returns a 200 status response with the updated post.
     * 
     * @param {object} req - The request object containing the post ID in params and the updated post data in the body.
     * @param {object} res - The response object to send back the result or error.
     */
    static async createPost (req, res){
        // checks if current user is logged in
        const userId = await authorizeUser(req, res);
        if (typeof userId !== 'string') return;

        const postData = req.body;
        const post = await addPost(postData);
        // checks if post is added to database
        if (post === null){
            return res.sendStatus(500);
        } else if (post.error) {
            return res.status(400).json(post);
        }
        // add created post id for response
        postData.id = post;
        res.status(201).json(post);
    }

    /**
     * Updates a post's data after verifying the user's authorization.
     * Retrieves the post by ID and checks if the current user is the author.
     * If the post is not found, returns a 404 error response.
     * If the user is unauthorized, returns a 401 error response.
     * If the update is successful, returns a 200 status response with the updated post.
     * 
     * @param {object} req - The request object containing the post ID in params and the updated post data in the body.
     * @param {object} res - The response object to send back the result or error.
     */
    static async updatePostData(req, res){
        // Checks if user current is logged in
        const userId = await authorizeUser(req, res);
        if (typeof userId !== 'string') return;

        const postId = req.params.postId;

        const post = await getPost(postId);
        if (post === null) return res.status(404).json({error: "Post not found"});
        if (post.authorId.toString() !== userId) return res.status(401).json({error: "Unauthorized"});
        const update = await updatePost(postId, req.body);
        
        if (update === null) return res.status(500).json({error: "Post upload unsuccessful"});
        return res.status(200).json(update);
    }

    /**
     * Deletes a post after verifying the user's authorization.
     * Retrieves the post by ID and checks if the current user is the author.
     * If the post is not found, returns a 404 error response.
     * If the user is unauthorized, returns a 401 error response.
     * If the deletion is successful, returns a 204 status response.
     * 
     * @param {object} req - The request object containing the post ID in params.
     * @param {object} res - The response object to send back the result or error.
     */
    static async delPost(req, res){
        // Checks if user current is logged in
        const userId = await authorizeUser(req, res);
        if (typeof userId !== 'string') return;

        const postId = req.params.postId;

        const post = await getPost(postId);
        if (post === null){
            return res.status(404).json({error: "Post not found"});
        } else if (post.authorId.toString() !== userId){
            return res.status(401).json({error: "Unauthorized user"});
        }
        const result = await deletePost(postId);
        return res.sendStatus(204);
    }

    /**
     * Searches for posts based on a specified category.
     * Retrieves the category from the request query and queries the database for posts with the matching category.
     * Returns a JSON response with the found posts if successful, otherwise handles errors.
     * 
     * @param {object} req - The request object containing the category in the query.
     * @param {object} res - The response object to send back the found posts or error.
     */
    static async searchPostByCategory(req, res){
        // gets query value
        const category = req.query.category;

        if (!category) return res.status(433).json({error: "No search keyword passed"});

        // finds of posts of specified category
        try{
            const posts = await db.collection("BlogPosts").find({category}).toArray();
            return res.status(200).json(posts);
        // catches error in case of DB interraction failure
        } catch (error){
            console.error(`Search error: ${error}`);
            return res.sendStatus(500);
        }
    }

    /**
     * Publishes a blog post by checking authorization of the user, retrieving the post by ID,
     * and adding the post to the database if it doesn't exist. 
     * If the post exists, updates the post if the author matches the current user.
     * 
     * @param {object} req - The request object containing the post ID and post data.
     * @param {object} res - The response object to send back the result or error.
     */
    static async publishPost(req, res){
        const postId = req.postId;

        const userId = await authorizeUser(req, res);
        if (typeof userId !== 'string') return res.sendStatus(401);

        let post = await getPost(postId);
        let result;
        if (post === null){
          post = req.body;
          if (!post.published) post.published = true;
            result = await addPost(post);
        }
        if (post.authorId !== userId) return res.sendStatus(401);
        result = await db.collection('BlogPost');
    }

    /**
     * Likes a specific post by adding the user's ID to the post's 'likes' array.
     * Retrieves the user's ID through authorization, then checks and fetches the user.
     * If the user is not found, returns an error response.
     * If the like action is unsuccessful, returns an error response.
     * @param {object} req - The request object containing the post ID in params.
     * @param {object} res - The response object to send back the result or error.
     */
    static async likePost(req, res){
        // gets and authenticates user
        const userId = await authorizeUser(req, res);

        if (typeof userId !== 'string') return;
        const postId = req.params.postId;
        const user = await getUser({_id: new ObjectId(userId)});
        if (!user) return res.status(404).json({error: "user not found"});

        const result = await db.collection('BlogPosts').updateOne({_id: new ObjectId(postId)}, 
        {$push: {likes: new ObjectId(userId)} });
        if (result.modifiedCount == 0) return res.status(500).json({error: "Like action unsucessful"});
    }
    /**
     * Unlike a post by removing the user's ID from the post's 'likes' array.
     * Retrieves the user's ID through authorization, then checks and fetches the user.
     * If the user is not found, returns an error response.
     * If the unlike action is unsuccessful, returns an error response.
     * 
     * @param {object} req - The request object containing the post ID in params.
     * @param {object} res - The response object to send back the result or error.
     */
    static async unlikePost(req, res){
        const userId = await authorizeUser(req, res);

        if (typeof userId !== 'string') return;
        const postId = req.params.postId
        const user = await getUser({_id: new ObjectId(userId)});
        if (!user) return res.status(404).json({error: "user not found"});

        const result = await db.collection('BlogPosts').updateOne({_id: new ObjectId(postId)}, 
        {$pull: {likes: new ObjectId(userId)} });
        if (result.modifiedCount == 0) return res.status(500).json({error: "Like action unsucessful"});

    }
}


export default BlogPostController;
