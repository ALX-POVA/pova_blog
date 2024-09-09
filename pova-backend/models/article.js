// models/article.js

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
})

/**
 * adds a new article to the data base
 * @param {object} - Article data
 * @returns {string} - Atricle inserted Id
 */
const addArticle = async (articleData) => {
    const {error} = articleSchema.validate(articleData);

    if (error) throw new Error(error.details[0].message);

    try{
        const result = await articles.insertOne(articleData);

        return result.insertedId.toString();
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * Gets an article by its id
 * @param {string} articleId - atricle id to get
 */

const getArticle = async (articleId) => {
    try{
        const atricle = await articles.findOne({_id: new ObjectId(articleId)});

        if (!atricle) return null;

        return atricle;
    } catch (err){
        console.error(err);
    }
}

/**
 * Deletes an article from the database
 * @param {string} articleId - atricle refrence to delete
 * @returns {string} - article refrence or null on failure
 */

const deleteArticle = async (articleId) => {
    try{
        const result = await articles.deleteOne({_id: new ObjectId(articleId)});
        // use count to confirm delete
        if (result.deletedCount) return articleId;
        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * getDrafts - gets user's draft articles
 * @param {string} userId - user's refrence
 * @returns {array} - list of atricle drafts
 */

const getDrafts = async (authorId) => {
    try {
        const drafts = await articles.find({authorId, published: false}).toArray();

        return drafts;
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * Updates an article
 * @param {string} articleId 
 * @param {object} update 
 * @returns 
 */
const updateArticle = async (articleId, update) => {
	// retreives user to update
	try {
		const article = await articles.findOne({_id: new ObjectId(articleId)});

		if (!user) return null;

		await articles.updateOne({$set: update});
        return await getArticle({_id: ObjectId(articleId)});
	} catch (error){
		console.error(error);
        return null;
	}
}

export {addArticle, getArticle, deleteArticle, updateArticle,
    getDrafts
};
