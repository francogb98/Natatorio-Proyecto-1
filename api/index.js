import express from "express";
import http from "http";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import "./src/db.js";

import morgan from "morgan";

import fileUpload from "express-fileupload";

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: [
    "https://www.natatorioolimpicomdc.com",
    "http://localhost:5173",
    "https://prueba-proyecto-mauve.vercel.app",
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

import {
  UserRouter,
  routerActivity,
  routerHours,
  routerPeticiones,
  routerPileta,
  routerStadistics,
} from "./src/routes/index.js";

app.use("/user", UserRouter);
app.use("/activity", routerActivity);
app.use("/pileta", routerPileta);
app.use("/hour", routerHours);
app.use("/stadistics", routerStadistics);
app.use("/peticion", routerPeticiones);

server.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("Servidor corriendo en el puerto: ", process.env.PORT);
});
