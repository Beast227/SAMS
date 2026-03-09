import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// custom imports
import sequelize from "./db/connectDB.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // sync models to the database (creates tables if they don't exist)
        await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.error('Unable to connect to the database: ', error);
    }
};

startServer();