import { Router } from "express";
import { handleCreateUser, handleGetUser, handleUserLogin } from "./controller/userController.js";
import verifyUser from "./controller/userAuthMiddleware.js";

const router = Router();

router
    .post('/', handleCreateUser)
    .post('/login', handleUserLogin)
    .get('/', verifyUser, handleGetUser);
    

export default router;