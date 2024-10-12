import { db } from "../config/db.js";
import joi from "joi";
import { ObjectId } from "mongodb";

class BlogModel {
  static blogs = db.collection("BlogPosts");

  static blogPostSchema = joi.object().keys({
    authorId: joi.string().required(),
    title: joi.string().required(),
    content: joi.string().required(),
    category: joi.string().required(),
    tags: joi.array().optional(),
    views: joi.number().default(0),
    published: joi.bool().default(false),
  });

  /**
   * Adds a new article to the database
   * @param {object} - Article data
   * @returns {string} - Article inserted Id
   */

  static addPost = async (blogData) => {
    const { error } = this.blogPostSchema.validate(blogData);

    if (error) return { error: error.details[0].message };

    try {
      // Convert authorId to ObjectId
      blogData.authorId = new ObjectId(blogData.authorId);
      blogData.createdAt = new Date();
      blogData.published = Boolean(blogData.published || false);

      const result = await this.blogs.insertOne(blogData);
      return result.insertedId.toString();
    } catch (err) {
      console.error("Error adding blog post:", err);
      return null;
    }
  };

  /**
   * Gets an article by its id
   * @param {string} articleId - article id to get
   * @returns {object|null} - The article or null if not found
   */
  static getPost = async (articleId) => {
    try {
      const article = await this.blogs.findOne({ _id: new ObjectId(articleId) });

      if (!article) return null;

      return article;
    } catch (err) {
      console.error("Error getting article:", err);
      return null;
    }
  };

  /**
   * Deletes an article from the database
   * @param {string} articleId - article reference to delete
   * @returns {string|null} - articleId if successful, or null on failure
   */
  static deletePost = async (articleId) => {
    try {
      const result = await this.blogs.deleteOne({ _id: new ObjectId(articleId) });

      if (result.deletedCount) return articleId;
      return null;
    } catch (err) {
      console.error("Error deleting article:", err);
      return null;
    }
  };

  /**
   * Gets user's draft articles
   * @param {string} authorId - user's reference
   * @returns {array|null} - list of article drafts or null on error
   */
  static getDrafts = async (authorId) => {
    try {
      // Convert authorId to ObjectId
      const drafts = await this.blogs
        .find({ authorId: new ObjectId(authorId), published: false })
        .toArray();
      return drafts;
    } catch (err) {
      console.error("Error getting drafts:", err);
      return null;
    }
  };

  /**
   * Updates an article
   * @param {string} articleId - article reference for update
   * @param {object} update - article data to update
   * @returns {object|null} - Updated article or null on failure
   */
  static updatePost = async (articleId, update) => {
    try {
      // Find the article
      const article = await this.getPost(articleId);
      console.log(article);

      if (!article) return null; // Article not found

      // Update the article's data
      update.updateAt = new Date();
      const result = await this.blogs.updateOne(
        { _id: new ObjectId(articleId) }, // Filter by article ID
        { $set: update } // Set the updated fields
      );

      if (result.modifiedCount > 0) {
        return await this.getPost(articleId); // Return the updated article
      } else {
        return null; // No changes made
      }
    } catch (error) {
      console.error("Error updating article:", error);
      return null;
    }
  };

  static async getPopularPosts(skip, limit) {
    const result = await this.blogs.find({published: true})
    .sort({views: -1})
    .skip(skip)
    .limit(limit)
    .toArray();

    return result;
  }

  static async searchByCategory(category, skip, limit) {
    const result = await this.blogs.find({published: true, category})
    .skip(skip)
    .limit(limit)
    .toArray();

    return result;
  }


  static async getUserPosts(authorId, skip, limit) {
    const result = await this.blogs.find({authorId, published: true})
    .skip(skip)
    .limit(limit)
    .toArray();

    return result;
  }

  static async addLiker(postId, authorId){
    const result = await this.blogs.updateOne(
      {_id: new ObjectId(postId)},
      {$addToSet: {likes: new ObjectId(authorId)}}
    );

    return result.modifiedCount > 0 ? true : false;
  }

  static async removeLiker(postId, authorId){
    const result = await this.blogs.updateOne(
      {_id: new ObjectId(postId)},
      {$pull: {likes: new ObjectId(authorId)}}
    );

    return result.modifiedCount > 0 ? true : false;
  }

  static async addComment(postId, comment){
    const result = await this.blogs.updateOne(
      { _id: new ObjectId(postId) },
      {$push: { comments: comment } });
    return result.acknowledged;
  }


  static async removeComment(postId, commentId){
    const postWithComment = await this.blogs.findOne(
      { _id: new ObjectId(postId),
        "comments._id": new ObjectId(commentId)
      },
      { projection: { "comments.$": 1 } }
    );

    if (!postWithComment) return { error: 'post with the comment specified not found' };

    const result = await this.blogs.updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { comments: { _id: new ObjectId(commentId) } } }
    );

    return result.acknowledged;
  }

  static async getPosts(skip, limit){
    try{
      const result = await this.blogs.find({published: true,
      }).skip(skip).limit(limit).sort({createdAt: -1}).toArray();

      result.forEach((post) => {
        delete post.content;
      })
      return result;
    } catch(err){
      console.error("Error getting posts:", err);
      return null;
    }
  }
}

export default BlogModel;
