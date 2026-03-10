import { prisma } from "../../db/prisma.js";
import { AuthRequest } from "../../users/controller/userAuthMiddleware.js";
import { Response } from "express";


const getDashboardSummary = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const assetFilter = { ownerId: req.user.id }

        const [totalAssets, onlineAssets, offlineAssets, activeAlerts] = await Promise.all([
            prisma.asset.count({
                where: assetFilter
            }),

            prisma.asset.count({
                where: { ...assetFilter, status: 'ONLINE' }
            }),

            prisma.asset.count({
                where: { ...assetFilter, status: 'OFFLINE' }
            }),

            prisma.alert.count({
                where: {
                    isResolved: false,
                    asset: assetFilter
                }
            })
        ]);

        res.status(200).json({
            data: {
                totalAssets,
                onlineAssets,
                offlineAssets,
                activeAlerts
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard summary: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export {
    getDashboardSummary
}