// blog post controller
import BlogModel  from "../models/blog.js";
import {db} from '../config/db.js'
import { ObjectId } from "mongodb";
import UserModel from "../models/user.js";


class BlogPostController{
  /**
  * Retrieves popular posts sorted by views in descending order with pagination.
  * Fetches posts from the 'BlogPosts' collection that are published.
  * Supports pagination based on the provided page and limit parameters.
  * Returns a JSON response with the sorted posts or an error message.
  * 
  * @param {object} req - The request object containing query parameters for page and limit.
  * @param {object} res - The response object to send back the sorted posts or an error message.
  * @returns {object} JSON response with popular posts or an error message.
  */
  static async getPopularPosts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      // Fetch posts sorted by views in descending order with pagination
      const popularPosts = await BlogModel.getPopularPosts(skip, limit);
        
      // Return the sorted posts
      return res.status(200).json(popularPosts);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred while fetching popular posts." });
    }
  }
  static async fetchUserPosts(req, res){
    const userId = req.params.userId || req.currentUserId;
    try{
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const posts = await BlogModel.getUserPosts(userId, skip, limit);
      return res.status(200).json(posts);
    } catch(err){
        console.error(err);
        return res.status(500).json({error: "An error occured while fetching user post"});
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
    const userId = req.currentUserId;

    if (typeof userId !== 'string') return;

    const drafts = await BlogModel.getDrafts(userId);
    if (drafts === null) return res.sendStatus(500);
    return res.status(200).json(drafts);
  }

  static async fetchPost(req, res){
    const postId = req.params.postId;

    const post = await BlogModel.getPost(postId);
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
    const userId = req.currentUserId;
    if (typeof userId !== 'string') return;

    const postData = req.body;
    const post = await BlogModel.addPost(postData);
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
    const userId = req.currentUserId;
    if (typeof userId !== 'string') return;

    const postId = req.params.postId;

    const post = await BlogModel.getPost(postId);
    if (post === null) return res.status(404).json({error: "Post not found"});
    if (post.authorId.toString() !== userId) return res.status(401).json({error: "Unauthorized"});
    const update = await BlogModel.updatePost(postId, req.body);
    
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
    const userId = req.currentUserId;
    if (typeof userId !== 'string') return;

    const postId = req.params.postId;

    const post = await BlogModel.getPost(postId);
    if (post === null){
      return res.status(404).json({error: "Post not found"});
    } else if (post.authorId.toString() !== userId){
      return res.status(401).json({error: "Unauthorized user"});
    }
    const result = await BlogModel.deletePost(postId);
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
    const category = req.query.category;

    if (!category) return res.status(433).json({error: "No search keyword passed"});

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try{
      const posts = await BlogModel.searchByCategory(category, skip, limit);
      return res.status(200).json(posts);
    } catch (error){
        console.error(`Search error: ${error}`);
        return res.status(500).json({error: "Error occured while searching for post"});
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
    const postId = req.params.postId;

    const userId = req.currentUserId;
    if (typeof userId !== 'string') return res.sendStatus(401);

    let post = await BlogModel.getPost(postId);
    let result;
    if (post === null){
      post = req.body;
      if (!post.published) post.published = true;
      result = await BlogModel.addPost(post);
    }
    if (post.authorId.toString() !== userId) return res.sendStatus(401);
    result = await BlogModel.updatePost(postId, {published: true});
    if (result === null) return res.status(500).json({error: "Post publish failed"});
    return res.status(200).json({message: "Post published"});
  }

  static async unPublishPost(req, res){
    const {postId, currentUserId} = req;

    const post = await BlogModel.getPost(postId);
    if (post === null) return res.status(404).json({error: "Post not found"});
    if (post.authorId.toString() !== currentUserId){
      return res.status(401).json({error: "Unauthorized", message: "User can't modify post"});
    }
    const result = await BlogModel.updatePost(postId, {published: null});

    if (result.modifiedCount === null){
      return res.status(500).json({error: "Post unpublish failed"});
    }

    return res.status(200).json({message: "Post unpublish successful"});
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
    const userId = req.currentUserId;

    if (typeof userId !== 'string') return;
    const postId = req.params.postId;
    const user = await UserModel.getUser({_id: new ObjectId(userId)});
    if (!user) return res.status(404).json({error: "user not found"});

    const result = await BlogModel.addLiker(postId, userId);
    return !result ? res.status(500).json({error: "Post like unsucessful"}) :
    res.status(201).json({message: "Post liked successfully"});
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
    const userId = req.currentUserId;

    if (typeof userId !== 'string') return;
    const postId = req.params.postId
    const user = await UserModel.getUser({_id: new ObjectId(userId)});
    if (!user) return res.status(404).json({error: "user not found"});

    const result = await BlogModel.removeLiker(postId, userId);
    if (result.modifiedCount == 0) return res.status(500).json({error: "Like action unsucessful"});
    return res.status(204).json({message: "unliked liked successfulled"});
  }
}

export default BlogPostController;
