import { prisma } from "../../lib/prisma.js";
import { AuthRequest } from "../../users/controller/userAuthMiddleware.js";
import { Response } from "express";

const addAsset = async (req: AuthRequest, res: Response) => {
  try {
    const { macAddress } = req.body;

    if (!macAddress) {
      res.status(400).json({ message: "MAC address is required to register" });
    }

    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const asset = await prisma.asset.create({
      data: {
        macAddr: macAddress,
        status: "OFFLINE",
        ownerId: req.user.id,
      },
    });

    res.status(201).json({
      message: "Asset successfully registered and assigned",
      data: asset,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Device with this Mac address already exists." });
    }

    console.error("Error registering asset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAssets = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const assets = await prisma.asset.findMany({
      where: {
        ownerId: req.user.id,
      },
      include: {
        telemetry: {
          orderBy: { timestamp: "desc" },
          take: 1,
        },
        alerts: {
          where: { isResolved: false },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res
      .status(201)
      .json({ message: "Successfully fetched assets", data: assets });
  } catch (error) {
    console.error("Error getting assets: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteAsset = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { macAddress } = req.body;
    if (!macAddress) {
      return res.status(400).json({ message: "Please provide the mac address for deletion" });
    }

    await prisma.asset.delete({
      where: {
        macAddr: macAddress
      }
    });

    return res.status(201).json({ message: "Successfully deleted asset" });
  } catch (error) {
    console.log("Error while deleting the asset: " , error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export { 
  addAsset, 
  getAssets,
  deleteAsset,
};
