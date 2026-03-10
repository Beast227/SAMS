import { DataTypes } from "sequelize";
import sequelize from "../../db/connectDB.js";

const Asset = sequelize.define('Asset', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    hostname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('online', 'offline', 'maintenance'),
        defaultValue: 'offline'
    }
}, {
    timestamps: true,
});

export default Asset;