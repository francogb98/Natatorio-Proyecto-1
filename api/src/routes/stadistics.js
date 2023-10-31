import { Router } from "express";

import { validarJWT } from "../middlewares/validar-jwt.js";

import Stadistics from "../models/models/Stadistics.js";

const routerStadistics = Router();

routerStadistics.get("/getStadistics", validarJWT, async (req, res) => {
  try {
    const stadistics = await Stadistics.find({}).populate({
      path: "activity",
    });
    res.json({ status: "ok", stadistics });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: "Error al obtener las estadisticas" });
  }
});

export default routerStadistics;
