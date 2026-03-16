import { Router } from "express";
import { getAlerts, handleResolveAlerts } from "./controllers/alertController.js";
import verifyUser from "../users/controller/userAuthMiddleware.js";


const router = Router();

router.get('/', verifyUser , getAlerts)
router.patch('/:assetId', verifyUser, handleResolveAlerts);

export default router;