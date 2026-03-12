import { Response } from "express";
import { AuthRequest } from "../../users/controller/userAuthMiddleware.js";
import { prisma } from "../../lib/prisma.js";

const getAlerts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;
        const skipAmount = (page - 1) * limit;

        const isResolvedFilter = status === 'RESOLVED';

        const whereCondition = {
            asset: {
                ownerId: req.user.id
            }
        };

        const [totalActive, totalResolved, alerts] = await Promise.all([
            prisma.alert.count({ 
                where: {
                    ...whereCondition,
                    isResolved: false
                }
            }),
            prisma.alert.count({
                where: {
                    ...whereCondition,
                    isResolved: true
                }
            }),
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



        res.status(200).json({ 
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
        });
        
    } catch (error) {
        console.error("Error while fetching alerts: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export { getAlerts };