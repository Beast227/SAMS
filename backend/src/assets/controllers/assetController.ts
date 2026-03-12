import { prisma } from "../../lib/prisma.js";
import { AuthRequest } from "../../users/controller/userAuthMiddleware.js";
import { Response } from "express";
import { Status } from "../../generated/prisma/enums.js";

const addAsset = async (req: AuthRequest, res: Response) => {
  try {
    const { devices } = req.body;

    if (!devices || !Array.isArray(devices) || devices.length === 0) {
      return res.status(400).json({ message: "Assets array is required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const assetsData = devices.map((device: { name: string; mac: string }) => ({
      name: device.name,
      macAddr: device.mac,
      status: Status.OFFLINE,
      ownerId: userId,
    }));

    const assets = await prisma.asset.createMany({
      data: assetsData,
      skipDuplicates: true,
    });

    res.status(201).json({
      message: "Assets successfully registered",
      createdCount: assets.count,
    });
  } catch (error) {
    console.error("Error registering assets:", error);
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
      return res
        .status(400)
        .json({ message: "Please provide the mac address for deletion" });
    }

    await prisma.asset.delete({
      where: {
        macAddr: macAddress,
      },
    });

    return res.status(201).json({ message: "Successfully deleted asset" });
  } catch (error) {
    console.log("Error while deleting the asset: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { addAsset, getAssets, deleteAsset };
