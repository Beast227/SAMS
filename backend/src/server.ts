import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { setUpTelemetrySocket } from "./telemetry/controllers/telemetrySocket.js";
import routers from './index.js';

dotenv.config();

const app = express();

// create the raw http server wrapping express
const httpServer = createServer(app);

// initialization of socket.io
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// initialize websockets
setUpTelemetrySocket(io);

const PORT = process.env.PORT || 6767;

app.use("/api", routers)

// Start the HTTP server (NOT app.listen)
const startServer = () => {
    try {
        httpServer.listen(PORT, () => {
            console.log(`Server and WebSockets are running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start the server:', error);
    }
};

startServer();