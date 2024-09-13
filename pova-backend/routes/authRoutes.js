import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const authRouter = Router();

authRouter.post('/register', AuthController.registerUser);
authRouter.post('/login', AuthController.loginUser);

export default authRouter;
