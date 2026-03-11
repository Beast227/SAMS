import { prisma } from "../lib/prisma.js";
import { Server, Socket } from "socket.io";
import redisClient from "../lib/redis.js";
import { ISystemTelemetryPayload } from "../types/telemetry.type.js";
import type { Asset, Telemetry } from "../generated/prisma/client.js";

export const setUpTelemetrySocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`New connection established: ${socket.id}`);

    // handle dashboard user joining the room
    const userId = socket.handshake.auth.userId;
    if (userId) {
      socket.join(`user_room_${userId}`);
    }

    socket.on("telemetry_stream", async (payload: ISystemTelemetryPayload) => {
      try {
        const { mac_address, cpu, memory, battery, timestamp } = payload;
        if (!mac_address) return;

        // store the mac addr in the socket
        if (!socket.data.mac_address) {
          socket.data.mac_address = mac_address;
        }

        // check the redis store for assetId
        const cacheKey = `mac_to_asset_id:${mac_address}`;
        let assetId = await redisClient.get(cacheKey);

        // if no assetId then get from db
        if (!assetId) {
          const asset = await prisma.asset.findUnique({
            where: { macAddr: mac_address },
            select: { id: true },
          });
          if (!asset) return;

          // cache the assetId mapped to the mac_addr
          assetId = asset.id as string;
          await redisClient.set(cacheKey, assetId, {
            expiration: {
              type: "EX",
              value: 3600,
            },
          });
        }

        // mark the asset online and add the new telemetry to the db
        const [updatedAsset, telemetryRecord] = (await prisma.$transaction([
          prisma.asset.update({
            where: { id: assetId },
            data: { status: "ONLINE" },
          }),
          prisma.telemetry.create({
            data: {
              assetId: assetId,
              cpuName: cpu.cpu_name,
              cpuTotalUsagePercent: cpu.total_usage_percent,
              cpuPerCoreUsage: cpu.per_core_usage_percent,
              cpuFrequency: cpu.frequency,
              cpuTemperature: cpu.temperature,
              memoryTotal: memory.total,
              memoryAvailable: memory.available,
              memoryUsed: memory.used,
              memoryUsagePercent: memory.usage_percent,
              batteryPercent: battery.percent,
              batteryPowerPlugged: battery.power_plugged,
              batterySecondsLeft: battery.seconds_left,
              timestamp: new Date(timestamp * 1000),
            },
          }),
        ])) as [Asset, Telemetry];

        // if user is online then update the data to the owners room
        if (updatedAsset.ownerId) {
          io.to(`user_room_${updatedAsset.ownerId}`).emit("dashboard_update", {
            mac_address,
            latestTelemetry: telemetryRecord,
          });
        }
      } catch (error) {
        console.error("Error processing telemetry stream:", error);
      }
    });

    socket.on("disconnect", async () => {
      const disconnectedMac = socket.data.mac_address;
      if (!disconnectedMac) return;

      if (disconnectedMac) {
        try {
          const asset = await prisma.asset.update({
            where: { macAddr: disconnectedMac },
            data: { status: "OFFLINE" },
            select: { ownerId: true },
          });

          if (asset.ownerId) {
            io.to(`user_room_${asset.ownerId}`).emit("asset_status_change", {
              macAddr: disconnectedMac,
              status: "OFFLINE",
            });
          }

          console.log(`${disconnectedMac} went offline`);
        } catch (error) {
          console.error(`Offline update failed for ${disconnectedMac}`);
        }
      }
    });
  });
};
