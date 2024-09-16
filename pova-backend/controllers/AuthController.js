import { addUser, getUser } from "../models/user.js";
import Joi from "joi";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateToken } from "../middlewares/tokenAuth.js";

class AuthController{
    static async registerUser(req, res) {
        // Extracts user data from request body
        const userData = req.body;
        const result = await addUser(userData);

        if (typeof result !== 'string'){
            return res.status(400).json(result);
        }
        // Add inserted id to the request payload as response
        userData.id = result;
        delete userData._id;
        userData.message = "user creation successful";
        return res.status(201).json(userData);
    }


    static async loginUser(req, res) {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        });

        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { email, password } = req.body;
        try {
            const user = await getUser({ email });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            // clean up the user object before sending the response
            user.id = user._id;
            delete user.password;
            delete user._id;

            const accessToken = generateToken(user.id, '24h');
            user.accessToken = accessToken;
            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "An error occurred" });
        }
    }
}
export default AuthController;
export {jwt};
