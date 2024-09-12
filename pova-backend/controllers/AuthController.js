import { addUser, getUser } from "../models/user.js";
import Joi from "joi";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
        return res.status(200).json(userData);
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
            user.userId = user._id;
            delete user.password;
            delete user._id;

            const accessToken = jwt.sign({user: user.id}, process.env.ACCESS_TOKEN_SECRET_KEY,
                {expiresIn: '2d'});
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
