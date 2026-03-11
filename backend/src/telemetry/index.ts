import { Router } from "express";
import { getHistoryTelemetry } from "./controller/telemetryController.js";
import verifyUser from "../users/controller/userAuthMiddleware.js";


const router = Router();

router.get('/history', verifyUser, getHistoryTelemetry);

export default router;