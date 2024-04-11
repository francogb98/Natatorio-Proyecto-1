import { Router } from "express";
import { autorizar } from "../controllers/pileta/autorizar.js";
import {
  getInfoPiletasPrueba,
  agregarUsuarioAPileta,
  iniciarTurno,
  eliminarUsuarioDePileta,
  obtener_pileta,
} from "../controllers/pileta/controller.pileta.js";
import User from "../models/models/User.js";

const routerPileta = Router();

routerPileta.get("/", getInfoPiletasPrueba);
routerPileta.patch("/", agregarUsuarioAPileta);
routerPileta.put("/", iniciarTurno);
routerPileta.put("/eliminar", eliminarUsuarioDePileta);
routerPileta.patch("/autorizar", autorizar);

routerPileta.post("/obtenerPileta", obtener_pileta);

routerPileta.get("/enviar", async (req, res) => {
  try {
    const { users } = req.body;

    for (const user of users) {
      const userSearch = await User.findOne({ customId: user });
      //si el certificado expiro y la diferencia es mayor a 10 pero menor a 14 mando una notificacion
      userSearch.notificaciones.push({
        asunto: "Actividad dada de baja",
        cuerpo: `Debido a la no actualizacion del certificado de pediculosis y micosis
             se le dio de baja de dicha activida, por favor cargar el certificado actualizado y volver a inscribirse en la actividad.
             Dias. Atte:Natatorio Olimpico`,
        fecha: fecha,
      });

      console.log("notificacion mandada", userSearch.customId);
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

export default routerPileta;
