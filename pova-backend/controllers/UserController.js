// controllers/UserController
import { authorizeUser } from '../middlewares/tokenAuth.js';
import {getUser, updateUser, deleteUser} from '../models/user.js';
import { ObjectId } from 'mongodb';

class UserController{
    static async fetchMe(req, res){
        
        // fetches verifies logged in user
        const userId = await authorizeUser(req, res);

        if (typeof userId !== 'string') return;

        const payload = await getUser({_id: new ObjectId(userId)});
        if (!payload) return res.status(404).json({error: "user not found"});
        payload.id = payload._id;
        delete payload._id
        delete payload.password;
        return res.status(200).json(payload);

    }

    static async fetchUser(req, res){
        // gets user id from parameter
        const userId = req.params.userId;
        const user = await getUser({id: new ObjectId(userId)});

        if (!user) return res.sendStatus(404);

        // clean user data before response
        delete user.password;
        user.id = user._id;
        delete user.id;
        return res.status(200).json(user)
    }

    static async updateMe(req, res){
        // checks if user authorized
        const userId = await authorizeUser(req, res);
        if (typeof userId !== 'string') return;
        // updates user data from database
        const update = await updateUser(userId, req.body);
        if(!update) return res.status(404).json({error: "user not found"})
        return res.status(200).json(update);
    }

    static async deleteMe(req, res){
        const userId = await authorizeUser(req, res);
        console.log("Delete requested");
        console.log(userId);
        if (typeof userId !== 'string') return;
        console.log("user authorized");

        try{
            if (await deleteUser(userId) === null) res.sendStatus(404);
            return res.sendStatus(204);
        } catch(err){
            console.error(err);
            return res.status(500).json({error: "An error occured"});
        }
    }
}

export default UserController;
