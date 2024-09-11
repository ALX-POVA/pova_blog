import { addUser, getUser } from "../models/user.js";
import bcrypt from 'bcryptjs';

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


    static async loginUser(req, res){
        // extracts credentials
        const cred = req.body;

        // Create a schema in models to valid login DO NOT FORGET
        if (!cred){
            return res.status(400).json({error: "Missing login credentials"});
        } else if (!'password' in cred){
            return res.status.json({"error": "Missing password"});
        } else if (!('email' in cred)){
            return res.status(400).json({error: "Missing email"});
        }

        const user = await getUser({email: cred.email});
        if (!user){
            return res.status(404).json({error: "User not found"});
            // compare password hash
        } else if (!bcrypt.compareSync(cred.password, user.password)){
            return res.status(401).json({error: "Unauthorized"});
        }
        user.id = user._id;
        delete user.password;
        delete user._id;
        res.status(200).json(user);
    }
}

export default AuthController;
