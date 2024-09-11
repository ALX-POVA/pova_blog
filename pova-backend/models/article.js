import { db } from '../config/db.js';
import joi from 'joi';
import { ObjectId } from 'mongodb';

const articles = db.collection("Articles");

const articleSchema = joi.object().keys({
    authorId: joi.string().required(),
    title: joi.string().required(),
    content: joi.string().required(),
    category: joi.string().optional(),
    tags: joi.array().optional()
});

/**
 * Adds a new article to the database
 * @param {object} - Article data
 * @returns {string} - Article inserted Id
 */
const addArticle = async (articleData) => {
    const { error } = articleSchema.validate(articleData);

    if (error) throw new Error(error.details[0].message);

    try {
        // Convert authorId to ObjectId
        articleData.authorId = new ObjectId(articleData.authorId);

        const result = await articles.insertOne(articleData);
        return result.insertedId.toString();
    } catch (err) {
        console.error('Error adding article:', err);
        return null;
    }
};

/**
 * Gets an article by its id
 * @param {string} articleId - article id to get
 * @returns {object|null} - The article or null if not found
 */
const getArticle = async (articleId) => {
    try {
        const article = await articles.findOne({ _id: new ObjectId(articleId) });

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
const deleteArticle = async (articleId) => {
    try {
        const result = await articles.deleteOne({ _id: new ObjectId(articleId) });

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
        const drafts = await articles.find({ authorId: new ObjectId(authorId), published: false }).toArray();
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
const updateArticle = async (articleId, update) => {
    try {
        // Find the article
        const article = await articles.findOne({ _id: new ObjectId(articleId) });

        if (!article) return null;  // Article not found

        // Update the article's data
        const result = await articles.updateOne(
            { _id: new ObjectId(articleId) },  // Filter by article ID
            { $set: update }  // Set the updated fields
        );

        if (result.modifiedCount > 0) {
            return await getArticle(articleId);  // Return the updated article
        } else {
            return null;  // No changes made
        }
    } catch (error) {
        console.error('Error updating article:', error);
        return null;
    }
};

export {
    addArticle,
    getArticle,
    deleteArticle,
    updateArticle,
    getDrafts
};
