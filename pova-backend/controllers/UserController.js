// controllers/UserController
import { db } from '../config/db.js';
import UserModel from '../models/user.js';
import { ObjectId } from 'mongodb';
import path from 'path';
import fs from 'fs';

class UserController{
    static async fetchMe(req, res, next){
        
        // fetches authorized user id
        const userId = req.currentUserId;

        if (typeof userId !== 'string') return;

        const payload = await UserModel.getUser({_id: new ObjectId(userId)});
        if (!payload) return res.status(404).json({error: "user not found"});
        payload.id = payload._id;
        delete payload._id
        delete payload.password;
        return res.status(200).json(payload);

    }

    static async fetchUser(req, res){
        // gets user id from parameter
        const userId = req.params.userId;
        const user = await UserModel.getUser({_id: new ObjectId(userId)});

        if (!user) return res.sendStatus(404);

        // clean user data before response
        delete user.password;
        user.id = user._id;
        delete user.id;
        return res.status(200).json(user);
    }

    static async updateMe(req, res){
        // checks if user authorized
        const userId = req.currentUserId;
        if (typeof userId !== 'string') return;
        // updates user data from database
        const update = await UserModel.updateUser(userId, req.body);
        if(!update) return res.status(404).json({error: "user not found"})
        return res.status(200).json(update);
    }

    static async deleteMe(req, res){
        const userId = req.currentUserId;
        console.log("Delete requested");
        console.log(userId);
        if (typeof userId !== 'string') return;
        console.log("user authorized");

        try{
            if (await UserModel.deleteUser(userId) === null) res.sendStatus(404);
            return res.sendStatus(204);
        } catch(err){
            console.error(err);
            return res.status(500).json({error: "An error occured"});
        }
    }

    static async uploadProfilePic(req, res) {
        const userId = req.currentUserId;
        if (typeof userId !== 'string') return;
        const user = await UserModel.getUser({_id: new ObjectId(userId)});

        if (!user) return res.status(404).json({error: "User not found"});

        const file = req.file;

        if (!file) return res.status(400).json({error: "No file uploaded"});

        const filePath = path.join('/uploads/images/', file.filename);
        const oldfile = path.join('.' + user.profilePicturePath);

        // Removes old file from storage
        if (fs.existsSync(oldfile)){
            fs.unlinkSync(path.join('.' + user.profilePicturePath))
        }

        //sets or update profile picture path
        const result = await db.collection('Users')
        .updateOne({ _id: new ObjectId(userId) },
        { $set:{ profilePicturePath: filePath } });

        if (result.modifiedCount === 0){
            return res.status(400).json({error: "Profile picture upload failed"});
        }
        return res.status(201).json({
            message: "Profile picture upload successful",
            profilePicturePath: filePath
        });
    }
}

export default UserController;
