import { DataTypes } from "sequelize";
import sequelize from "../../db/connectDB.js";
import { timeStamp } from "node:console";

const Telemetry = sequelize.define('Telemetry', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    assetId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cpuName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cpuTotalUsagePercent: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    cpuPerCoreUsage: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    cpuTemperature: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    // --- Memory Metrics ---

    memoryTotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    memoryAvailable: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    meomoryUsed: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    memmoryUsagePercent: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // ----- battery metrics ----
    batteryPercent: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    batteryPowerPlugged: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    batterySecondsLeft: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    // ---- Meta ----
    timeStamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    timestamps: false,
});

export default Telemetry;