import { Router } from "express";
import { getDashboardSummary } from "./controllers/analyticsController.js";
import verifyUser from "../users/controller/userAuthMiddleware.js";


const router = Router();

router.get('/analysis', verifyUser ,getDashboardSummary);

export default router;