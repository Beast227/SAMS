import { Router } from "express";
import userRoutes from "./users/index.js";
import assetRoutes from "./assets/index.js";

const router = Router();

router.use("/user", userRoutes);
router.use("/asset", assetRoutes);

export default router;