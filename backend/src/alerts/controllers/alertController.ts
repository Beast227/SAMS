import { Response } from "express";
import { AuthRequest } from "../../users/controller/userAuthMiddleware.js";
import { prisma } from "../../lib/prisma.js";
import redisClient from "../../lib/redis.js";

const getAlerts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;
        const search = req.query.search as string || "";
        const severity = req.query.severity as string || "ALL";
        const timeFrame = req.query.timeFrame as string || "ALL_TIME";
        
        const cacheKey = `alerts:${req.user.id}:${status}:p${page}:l${limit}:s${search}:sev${severity}:t${timeFrame}`;

        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            res.status(200).json(JSON.parse(cachedData));
            return;
        }
        const skipAmount = (page - 1) * limit;
        const isResolvedFilter = status === 'RESOLVED';

        const whereCondition: any = {
            asset: {
                ownerId: req.user.id
            },
            isResolved: isResolvedFilter
        };

        if (severity !== "ALL") {
            whereCondition.type = severity;
        }

        if (search) {
            whereCondition.OR = [
                // { assetId: { contains: search, mode: "insensitive" } },
                { message: { contains: search, mode: "insensitive" } }
            ];

            if (search.length === 36) {
                whereCondition.or.push({
                    assetId: { equals: search }
                })
            }
        }

        let startDate = new Date();
        if (timeFrame !== "ALL_TIME") {
            const now = new Date();

            if (timeFrame === "24H") startDate.setHours(now.getHours() - 24);
            else if (timeFrame === "7D") startDate.setDate(now.getDate() - 7);
            else if (timeFrame === "30D") startDate.setDate(now.getDate() - 30);

            whereCondition.createdAt = { gte: startDate };
        }

        const [totalActive, totalResolved, alerts] = await Promise.all([
            prisma.alert.count({ where: { asset: { ownerId: req.user.id }, isResolved: false, ...(timeFrame !== "ALL_TIME" && { createdAt: { gte: startDate } }) } }),
            prisma.alert.count({ where: { asset: { ownerId: req.user.id }, isResolved: true, ...(timeFrame !== "ALL_TIME" && { createdAt: { gte: startDate } }) } }),
            prisma.alert.findMany({
                where: {
                    ...whereCondition,
                    isResolved: isResolvedFilter
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: skipAmount,
                take: limit
            })
        ]);

        const totalForCurrentView = isResolvedFilter ? totalResolved : totalActive;
        const totalPages = Math.ceil(totalForCurrentView / limit);

        const responsePayload = { 
            message: "successfully fetched alerts", 
            data: alerts,
            counts: {
                active: totalActive,
                resolved: totalResolved
            },
            pagination: {
                currentPage: page,
                totalPages: totalPages === 0 ? 1 : totalPages,
                totalItems: totalForCurrentView,
                itemsPerPage: limit
            }
        }

        await redisClient.set(cacheKey, JSON.stringify(responsePayload), {
            expiration: {
                type: "EX",
                value: 60
            }
        });

        res.status(200).json(responsePayload);
        
    } catch (error) {
        console.error("Error while fetching alerts: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export { getAlerts };