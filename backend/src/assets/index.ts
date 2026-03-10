import { Router } from "express";
import { addAsset, getAssets } from "./controllers/assetController.js";
import verifyUser from "../users/controller/userAuthMiddleware.js";

const router = Router();

router.post('/add', verifyUser, addAsset);
router.get('', verifyUser, getAssets);

export default router;