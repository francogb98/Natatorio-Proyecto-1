import { Router } from "express";
import { UsuariosFalta } from "../models/UsuariosFaltas.js";
import mongoose from "mongoose";

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
rutaUsuarioFalta.post("/", async (req, res) => {
  try {
    const nuevo = new UsuariosFalta({
      motivo: "certificado_expirado",
    });
    await nuevo.save();
    return res.status(200).json({ msg: "pileta creada" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(400)
      .json({ status: "error", message: "error en el sevidor" });
  }
});

//dar de baja
rutaUsuarioFalta.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const users = await UsuariosFalta.updateOne(
      { users: { $in: [id] } },
      { $pull: { users: id } }
    )
      .then((result) => {
        if (result.modifiedCount === 0) {
          console.log("No UsuariosFalta document found with user ID:", id);
        } else {
          console.log("User ID", id, "successfully removed");
        }
      })
      .catch((err) => {
        console.error(
          "Error removing user ID",
          userIdToRemove,
          "from UsuariosFalta:",
          err
        );
      });
    return res.status(200).json({ msg: "todo ok" });
  } catch (error) {
    console.log(error.message);

    return res.status(400).json({ msg: "error en el servidor" });
  }
});

export default rutaUsuarioFalta;
