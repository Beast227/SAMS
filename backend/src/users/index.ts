import { Router } from "express";
import { handleCreateUser, handleUserLogin } from "./controller/userController.js";

const router = Router();

router.post('/', handleCreateUser)
router.post('/login', handleUserLogin)

export default router;