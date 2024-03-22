import { Router } from "express";
import UsuariosFalta from "../models/models/UsuariosFaltas.js";

const rutaUsuarioFalta = Router();

//obtner usuarios
rutaUsuarioFalta.get("/", async (req, res) => {
  try {
    const usuariosConFalta = await UsuariosFalta.find();

    return res.status(200).json({ status: "success", usuariosConFalta });
  } catch (error) {
    console.log(error.message);
    return res
      .status(400)
      .json({ status: "error", message: "error en el sevidor" });
  }
});

//dar de baja
rutaUsuarioFalta.post("/", (req, res) => {});

export default rutaUsuarioFalta;
