import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DB_URL || "localhost";

const sequelize = new Sequelize(
    connectionString, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

export default sequelize;