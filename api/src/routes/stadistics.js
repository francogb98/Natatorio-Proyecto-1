import { Router } from "express";

import { validarJWT } from "../middlewares/validar-jwt.js";
import { Stadistic } from "../models/index.js";

const routerStadistics = Router();

routerStadistics.get("/getStadistics", validarJWT, async (req, res) => {
  try {
    const stadistics = await Stadistic.find({}).populate({
      path: "activity",
    });
    res.json({ status: "ok", stadistics });
  } catch (error) {
    error;
    res.json({ status: "error", message: "Error al obtener las estadisticas" });
  }
});

export { routerStadistics };
