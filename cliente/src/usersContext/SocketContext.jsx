import React, { useContext, useEffect } from "react";
import { createContext } from "react";
import { useSocket } from "../hooks/useSocket";
import { AuthContext } from "../auth/AuthContext";
import { ChatContext } from "./chat/ChatContext";
import { types } from "../types/types";
import { scrollToBottom } from "react-scroll/modules/mixins/animate-scroll";
import { scrollToBottomAnimated } from "../helpers/scrollToBottom";

export const SocketContext = createContext();
const baseUrl = import.meta.env.VITE_API_URL;
export const SocketProvider = ({ children }) => {
  const { socket, online, conectarSocket, desconectarSocket } =
    useSocket(baseUrl);
  const { auth } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (auth.logged) {
      conectarSocket();
    }
  }, [auth, conectarSocket]);
  useEffect(() => {
    if (!auth.logged) {
      desconectarSocket();
    }
  }, [auth, desconectarSocket]);
  //escuchar cambios en usuarios conectados
  useEffect(() => {
    socket?.on("lista-usuarios", (usuarios) => {
      dispatch({
        type: types.usuariosCargados,
        payload: usuarios,
      });
    });
  }, [socket, dispatch]);
  useEffect(() => {
    socket?.on("mensaje-personal", (mensaje) => {
      //hacer dispatch de una accion
      dispatch({
        type: types.nuevoMensaje,
        payload: mensaje,
      });
      //mover el scroll al final
      setTimeout(() => {
        scrollToBottomAnimated("mensajes");
      }, 0);
    });
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, online }}>
      {children}
    </SocketContext.Provider>
  );
};
