import { Router } from "express";

const routerPrueba = Router();

routerPrueba.get("/send-message/:message", (req, res) => {
  const message = req.params.message;
  io.emit("newMessage", message); // Emitir el mensaje a todos los clientes conectados
  res.send(`Sent message: ${message}`);
});
export default routerPrueba;
