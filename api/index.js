import express from "express";
import http from "http";
import cors from "cors";

import router from "./src/routes/user.js";
import routerActivity from "./src/routes/activity.js";
import routerPileta from "./src/routes/pileta.js";

import dotenv from "dotenv";
dotenv.config();

import "./src/db.js";
import routerHours from "./src/routes/hours.js";

import routerStadistics from "./src/routes/stadistics.js";

import morgan from "morgan";

import fileUpload from "express-fileupload";

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: [
    "https://www.natatorioolimpicomdc.com",
    "http://localhost:5173",
    "https://natatorio-proyecto-1-zvny.vercel.app",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(cors(corsOptions));
app.use(express.json());
app.use("/user", router);
app.use("/activity", routerActivity);
app.use("/hour", routerHours);
app.use("/pileta", routerPileta);
app.use("/stadistics", routerStadistics);

app.use(morgan("dev"));

server.listen(process.env.PORT, "0.0.0.0", () => {
  "Socket.IO server listening on port", process.env.PORT;
});
