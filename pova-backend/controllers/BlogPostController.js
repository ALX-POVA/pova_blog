// blog post controller
import { addPost, getPost, updatePost, deletePost, getDrafts } from "../models/blog.js";
import {db} from '../config/db.js'
import { ObjectId } from "mongodb";
import { authorizeUser } from "../middlewares/tokenAuth.js";


class BlogPostController{
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

        const drafts = getDrafts(session.user);
        if (drafts === null) return res.sendStatus(500);
        return res.status(200).json(drafts);
    }

    static async fetchPost(req, res){
        const postId = req.params.postId;

        const post = await getPost(postId);
        if (!post) return res.status(404).json({error: "Post not found"});
        return res.status(200).json(post);
    }

    /**
     * creates a new post object
     * @param {object} req 
     * @param {object} res 
     * @returns response
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
     * Updates data of a post
     * @param {req} req - request object
     * @param {object} res - response object
     * @returns 
     */
    static async updatePostData(req, res){
        // Checks if user current is logged in
        const userId = await authorizeUser(req, res);
        if (typeof userId !== 'string') return;

        const postId = req.params.postId;

        const post = await getPost(postId);
        if (post === null) return res.status(404).json({error: "Post not found"});
        if (post.authorId !== userId) return res.status(401).json({error: "Unauthorized"});
        const update = await updatePost(postId, req.body);
        
        if (update === null) return res.status(500).json({error: "Post upload unsuccessful"});
        return res.status(200).json(update);
    }

    /**
     * deletes a post by its Id
     * @param {object} req 
     * @param {object} res 
     * @returns response
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
     * searches a blog post by category
     * @param {object} req - request obejct
     * @param {object} res - response object
     * @returns - response
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

    static async publishPost(req, res){
        const postId = req.postId;

        const userId = await authorizeUser(req, res);
        if (typeof userId !== 'string') return res.sendStatus(401);

        let post = await getPost(postId);
        if (post === null){
          post = req.body;
          const result = await addPost(post);  
        }
        if (post.authorId !== userId) return res.sendStatus(401);
    }
}


export default BlogPostController;
