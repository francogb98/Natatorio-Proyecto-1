import { Router } from "express";
import { PiletaController } from "../controllers/pileta/controller.pileta.js";
import { verificacionEstadoUsuarios } from "../controllers/pileta/utilidades/estadoUsuario.js";

const routerPileta = Router();

routerPileta.get("/", PiletaController.getInfoPiletas);
routerPileta.patch("/", PiletaController.agregarUsuarioAPileta);
routerPileta.put(
  "/",
  PiletaController.verificarCambioDeTurno,
  verificacionEstadoUsuarios,
  PiletaController.iniciarTurno
);
routerPileta.put("/eliminar", PiletaController.eliminarUsuarioDePileta);
routerPileta.post("/obtenerPileta", PiletaController.obtener_pileta);
routerPileta.post("/prueba", verificacionEstadoUsuarios);

// routerPileta.patch("/autorizar", autorizar);

// routerPileta.get("/enviar", async (req, res) => {
//   try {
//     const { users } = req.body;

//     for (const user of users) {
//       const userSearch = await User.findOne({ customId: user });
//       //si el certificado expiro y la diferencia es mayor a 10 pero menor a 14 mando una notificacion
//       userSearch.notificaciones.push({
//         asunto: "Actividad dada de baja",
//         cuerpo: `Debido a la no actualizacion del certificado de pediculosis y micosis
//              se le dio de baja de dicha activida, por favor cargar el certificado actualizado y volver a inscribirse en la actividad.
//              Dias. Atte:Natatorio Olimpico`,
//         fecha: fecha,
//       });

//       console.log("notificacion mandada", userSearch.customId);
//     }

//     return res.status(200).json(users);
//   } catch (error) {
//     return res.status(400).json({ msg: error.message });
//   }
// });

export { routerPileta };
