import { prisma } from '../../db/prisma.js';
import { Server, Socket } from 'socket.io';

export const setUpTelemetrySocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`New connection established: ${socket.id}`);
        console.log(socket.data)

        socket.on('telemetry_stream', async (payload) => {
            try {
                const { mac_address, cpu, memory, battery } = payload;
                console.log(payload);

                if (!mac_address) return;

                if (!socket.data.mac_address) {
                    socket.data.mac_address = mac_address;
                }

                const asset = await prisma.asset.upsert({
                    where: { macAddr: mac_address },
                    update: { status: 'ONLINE' },
                    create: {
                        macAddr: mac_address,
                        status: 'ONLINE',
                        cpuName: cpu?.cpu_name
                    }
                });

                const telemetryRecord = await prisma.telemetry.create({
                    data: {
                        assetId: asset.id,
                        cpuTotalUsagePercent: cpu?.total_usage_percent,
                        cpuPerCoreUsage: cpu?.per_core_usage_percent || [],
                        cpuFrequency: cpu?.frequency,
                        cpuTemperature: cpu?.temperature,
                        memoryTotal: memory?.total,
                        memoryAvailable: memory?.available,
                        memoryUsed: memory?.used,
                        memoryUsagePercent: memory?.usage_percent,
                        batteryPercent: battery?.percent,
                        batteryPowerPlugged: battery?.power_plugged,
                        batterySecondsLeft: battery?.seconds_left,
                    }
                });

                io.emit('dashboard_update', {
                    asset,
                    latestTelemetry: telemetryRecord
                });
            } catch (error) {
                console.error('Error processing telemetry stream:', error);
            }
        });

        socket.on('disconnect', async () => {
            console.log(`Client disconneccted: ${socket.id}`);

            const disconnectedMac = socket.data.mac_address;
            console.log(disconnectedMac);
            if (disconnectedMac) {
                try {
                    await prisma.asset.update({
                        where: { macAddr: disconnectedMac },
                        data: { status: 'OFFLINE' }
                    });

                    console.log(`Asset ${disconnectedMac} marked as offline`);

                    io.emit('asset_status_change', {
                        macAddr: disconnectedMac,
                        status: 'OFFLINE'
                    });
                } catch (error) {
                    console.error(`Failed to update offline status for ${disconnectedMac}`);
                }
            }
        });
    });
};