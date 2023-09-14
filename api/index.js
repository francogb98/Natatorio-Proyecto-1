import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import router from "./src/routes/user.js";
import routerActivity from "./src/routes/activity.js";
import routerPileta from "./src/routes/pileta.js";

import dotenv from "dotenv";
dotenv.config();

import "./src/db.js";
import routerHours from "./src/routes/hours.js";
import { Socket } from "./src/models/models/Socket.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const corsOptions = {
  origin: "https://natatorio-proyecto-1.vercel.app",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/user", router);
app.use("/activity", routerActivity);
app.use("/hour", routerHours);
app.use("/pileta", routerPileta);

Socket(io);

server.listen(4000, () => {
  console.log("Socket.IO server listening on port 4000");
});
