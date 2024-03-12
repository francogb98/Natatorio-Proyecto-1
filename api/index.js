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
import rutaAutorizado from "./src/routes/autorizado.router.js";
import rutaFeed from "./src/routes/feedback.js";

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: [
    "https://www.natatorioolimpicomdc.com",
    "http://localhost:5173",
    "https://natatorio-proyecto-1-zvny.vercel.app",
    "https://natatorio-proyecto-1-zvny-git-main-francogb98.vercel.app/",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(morgan("dev"));

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
app.use("/autorizado", rutaAutorizado);
app.use("/feedback", rutaFeed);

server.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("Socket.IO server listening on port", process.env.PORT);
});
