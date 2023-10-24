import {
  addUser,
  addUserNextTurn,
  cambioDeTurno,
} from "../../controllers/pileta/addUserFromPileta.js";
import { finalizar } from "../../controllers/pileta/finalizarTurno.js";

export const Socket = (io) => {
  io.on("connection", async (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    socket.on("agregar-usuario", async (args) => {
      const result = await addUser(args);
      //si el resultado es un error lo enviamos al cliente pero solo al cliente que lo envio quiero que lo escuche solo el

      if (!result.ok) {
        socket.emit("lista-usuarios", result);
      } else {
        //si no es un error enviamos el resultado a todos los clientes conectados
        io.emit("lista-usuarios", result);
      }
    });
    socket.on("agregar-usuario-turno-siguiente", async (args) => {
      const result = await addUserNextTurn(args);
      if (!result.ok) {
        socket.emit("lista-usuarios-siguient-turno", result);
      } else {
        //si no es un error enviamos el resultado a todos los clientes conectados
        io.emit("lista-usuarios-siguient-turno", result);
      }
    });

    socket.on("cambiar-turno", async (args) => {
      const result = await cambioDeTurno(args);

      io.emit("cambiar-turno", result);
    });

    socket.on("finalizar-turno", async () => {
      const result = await finalizar();

      io.emit("finalizar-turno", result);
    });
    // Aquí puedes definir lógica para enviar y recibir mensajes en tiempo real
    socket.on("chatMessage", (message) => {
      console.log("Received message:", message);
      io.emit("chatMessage", message); // Emitir el mensaje a todos los clientes conectados
    });
  });
};
