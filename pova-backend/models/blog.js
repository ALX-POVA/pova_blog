import { db } from '../config/db.js';
import joi from 'joi';
import { ObjectId } from 'mongodb';

const blogs = db.collection("BlogPosts");

const blogPostSchema = joi.object().keys({
    authorId: joi.string().required(),
    title: joi.string().required(),
    content: joi.string().required(),
    category: joi.string().required(),
    tags: joi.array().optional(),
    views: joi.number().default(0),
    published: joi.bool().default(false)
});

/**
 * Adds a new article to the database
 * @param {object} - Article data
 * @returns {string} - Article inserted Id
 */
const addPost = async (blogData) => {
    const { error } = blogPostSchema.validate(blogData);

    if (error) return {error: error.details[0].message};

    try {
        // Convert authorId to ObjectId
        blogData.authorId = new ObjectId(blogData.authorId);
        blogData.createdAt = new Date();

        const result = await blogs.insertOne(blogData);
        return result.insertedId.toString();
    } catch (err) {
        console.error('Error adding blog post:', err);
        return null;
    }
};

/**
 * Gets an article by its id
 * @param {string} articleId - article id to get
 * @returns {object|null} - The article or null if not found
 */
const getPost = async (articleId) => {
    try {
        const article = await blogs.findOne({ _id: new ObjectId(articleId) });

        if (!article) return null;

        return article;
    } catch (err) {
        console.error('Error getting article:', err);
        return null;
    }
};

/**
 * Deletes an article from the database
 * @param {string} articleId - article reference to delete
 * @returns {string|null} - articleId if successful, or null on failure
 */
const deletePost = async (articleId) => {
    try {
        const result = await blogs.deleteOne({ _id: new ObjectId(articleId) });

        if (result.deletedCount) return articleId;
        return null;
    } catch (err) {
        console.error('Error deleting article:', err);
        return null;
    }
};

/**
 * Gets user's draft articles
 * @param {string} authorId - user's reference
 * @returns {array|null} - list of article drafts or null on error
 */
const getDrafts = async (authorId) => {
    try {
        // Convert authorId to ObjectId
        const drafts = await blogs.find({ authorId: new ObjectId(authorId), published: false })
        .toArray();
        return drafts;
    } catch (err) {
        console.error('Error getting drafts:', err);
        return null;
    }
};

/**
 * Updates an article
 * @param {string} articleId - article reference for update
 * @param {object} update - article data to update
 * @returns {object|null} - Updated article or null on failure
 */
const updatePost = async (articleId, update) => {
    try {
        // Find the article
        const article = await blogs.findOne({ _id: new ObjectId(articleId) });

        if (!article) return null;  // Article not found

        // Update the article's data
        update.updateAt = Date()
        const result = await blogs.updateOne(
            { _id: new ObjectId(articleId) },  // Filter by article ID
            { $set: update }  // Set the updated fields
        );

        if (result.modifiedCount > 0) {
            return await getPost(articleId);  // Return the updated article
        } else {
            return null;  // No changes made
        }
    } catch (error) {
        console.error('Error updating article:', error);
        return null;
    }
};

export {
    addPost,
    getPost,
    deletePost,
    updatePost,
    getDrafts
};
