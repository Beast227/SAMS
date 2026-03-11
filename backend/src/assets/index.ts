import { Router } from "express";
import { addAsset, deleteAsset, getAssets } from "./controllers/assetController.js";
import verifyUser from "../users/controller/userAuthMiddleware.js";
import { getDashboardSummary } from "./controllers/analyticsController.js";

const router = Router();

router
    .post('/add', verifyUser, addAsset)
    .get('', verifyUser, getAssets)
    .get('/analysis', verifyUser, getDashboardSummary)
    .delete('/delete', verifyUser, deleteAsset);

export default router;