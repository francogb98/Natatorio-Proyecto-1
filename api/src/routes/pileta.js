import { Router } from "express";
import {
  getInfoPiletas,
  getPiletasOrCreate,
} from "../controllers/pileta/getPiletas.js";
import { reiniciarPiletaManual } from "../controllers/pileta/borradaPiletaManual.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const routerPileta = Router();

routerPileta.get("/getAll", getInfoPiletas);
routerPileta.get("/getPiletas", getPiletasOrCreate);

routerPileta.post("/add", (req, res) => {
  console.log(req.body);
  res.json({ status: "success", message: "Pileta Agregada" });
});
routerPileta.post("/restart", validarJWT, reiniciarPiletaManual);

export default routerPileta;
