// models/user.js
/**
 * This module defines user schemas and Validations
 */

import joi from 'joi';
import { db } from '../config/db.js';
import { ObjectId } from 'mongodb';

const users = db.collection('Users');

const userSchema = joi.object().keys({
  firstName: joi.string().min(3).max(60).required(),
  lastName: joi.string().min(3).max(60).required(),
  username: joi.string().min(5).max(30),
  password: joi.string().min(8).max(50).required(),
  email: joi.string().required()
});


/**
 * adds user to the data base
 * @param user data object
 * @return {string} user Id
 */

const addUser = async (userData) => {
  const { error } = userSchema.validate(userData);

  // validates 
  if (error){
    throw new Error(error.details[0].message);
  }

  try{
    const result = await users.insertOne(userData);
    return result.insertedId.toString();
  } catch (err){
    console.error(err.message);
    return null;
  }
}

/**
 * Gets a user by query property
 * @param {object} getQuery - Query object to find user in the database
 * @returns {object} - The user data or null
 */
const getUser = async (getQuery) => {
  const user = await users.findOne(getQuery);

	if (!user) return null;
	delete user.password;
  return user
}

/**
 * Deletes a user by id
 * @param {string} userId - user refrence/id
 * @returns {string|null} - return userId if successful or null on failure | error
 */

const deleteUser = async (userId) => {
	try{
		const result = await users.deleteOne({_id: new ObjectId(userId)});
		if (result.deletedCount > 0) return userId.toString();
		return null;
	} catch (err) {
		console.error(err);
		return undefined // to indicated error
	}
}

/**
 * Updates user
 * @param {string} userId - user refrence for update
 * @param {object} update - user data to update
 * @returns {object} - user object with changes
 */

const updateUser = async (userId, update) => {
  try {
    // Ensure userId is a valid ObjectId
    const user = await users.findOne({ _id: ObjectId(userId) });

    if (!user) {
      return null;  // User not found
    }

    // Update the user's data
    const result = await users.updateOne(
      { _id: ObjectId(userId) },  // Filter: update the user with this userId
      { $set: update }  // Set the fields to be updated
    );

    if (result.modifiedCount > 0) {
      // Return the updated user or a success message
      return await users.findOne({ _id: ObjectId(userId) });  // Optionally, return updated user
    } else {
      return null;  // No changes made
    }
  } catch (err) {
    console.error(err);
    return null;  // Handle the error appropriately
  }
};


export { userSchema, getUser, addUser, deleteUser, updateUser}
