// models/user.js
import Joi from 'joi';
import { db } from '../config/db.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

const users = db.collection('Users');

const userSchema = Joi.object({
  fullName: Joi.string().min(3).max(60).required().messages({
    'string.base': 'Full name must be a string',
    'string.min': 'Full name should have a minimum length of 3',
    'string.max': 'Full name should have a maximum length of 60',
    'any.required': 'Missing fullName field',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Missing email field'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password should have a minimum length of 8',
    'any.required': 'Missing password field'
  }),
});

/**
 * 
 * @param {object} userData - User data to validate
 * @returns {object|null} object with error message if validation failed, null on success
 */
const validateUser = (userData) => {
  const { error } = userSchema.validate(userData, { abortEarly: false });

  if (error) {
    // Extract error message from Joi details
    const errors = error.details.map(detail => {
      return { error: detail.message };
    });
    return errors[0]; // return first validation error
  }
}

/**
 * Adds user to the database
 * @param {object} userData - user data
 * @return {string|null} - user Id
 */
const addUser = async (userData) => {
  const validationError = validateUser(userData);
    if (validationError)
      return validationError;

  try {
    const existingUser = await users.findOne({email: userData.email});

    if (existingUser){
      return {error: "User already exists"};
    }
    userData.password = bcrypt.hashSync(userData.password, 10);
    userData.createdAt = new Date();
    const result = await users.insertOne(userData);
    delete userData.password;
    return result.insertedId.toString();
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

/**
 * Gets a user by query property
 * @param {object} getQuery - Query object to find user in the database
 * @returns {object|null} - The user data or null
 */
const getUser = async (getQuery) => {
  const user = await users.findOne(getQuery);
  if (!user) return null;
  return user;
};

/**
 * Deletes a user by id
 * @param {string} userId - user reference/id
 * @returns {string|null} - userId if successful or null
 */
const deleteUser = async (userId) => {
  try {
    const result = await users.deleteOne({ _id: new ObjectId(userId) });
    return result.deletedCount > 0 ? userId.toString() : null;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

/**
 * Updates user
 * @param {string} userId - user reference for update
 * @param {object} update - user data to update
 * @returns {object|null} - updated user object or null
 */
const updateUser = async (userId, update) => {
  try {
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) return null;

    if ('password' in update){
      update.password = bcrypt.hashSync(update.password, 10);
    }
    update.updatedAt = new Date();
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: update }
    );
		const modifiedUser = await users.findOne({ _id: new ObjectId(userId) });
    delete modifiedUser.password;
    return result.modifiedCount > 0 ? modifiedUser : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export { userSchema, getUser, addUser, deleteUser, updateUser };
