import { Response } from "express";
import { AuthRequest } from "../../users/controller/userAuthMiddleware.js";
import { prisma } from "../../lib/prisma.js";
import { Params } from "../../types/telemetry.type.js";

const getHistoryTelemetry = async (req: AuthRequest & { params: Params }, res: Response) => {
    try {
        const { assetId } = req.params;
        const { range } = req.query;

        if (!assetId) return res.status(400).json({ message: "Please provide the required details." });

        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const timeThreshold = new Date();

        if (range === '24h') {
            timeThreshold.setHours(timeThreshold.getHours() - 24);
        } else if (range === '7d') {
            timeThreshold.setDate(timeThreshold.getDate() - 7);
        } else {
            timeThreshold.setHours(timeThreshold.getHours() - 1);
        }

        const history = await prisma.telemetry.findMany({
            where: {
                assetId: assetId,
                timestamp: {
                    gte: timeThreshold
                }
            },

            select: {
                cpuTotalUsagePercent: true,
                memoryUsagePercent: true,
                cpuTemperature: true,
                timestamp: true
            },
            
            orderBy: {
                timestamp: 'asc'
            }
        });

        res.status(200).json({
            message: "Successfully fetched historical data",
            data: history
        });

    } catch (error) {
        console.error('Error fetching historical telemetry: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export {
    getHistoryTelemetry
}