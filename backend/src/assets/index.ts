import { Router } from "express";
import { addAsset } from "./controllers/assetController.js";
import verifyUser from "../users/controller/userAuthMiddleware.js";

const router = Router();

router.post('/add', verifyUser, addAsset);

export default router;