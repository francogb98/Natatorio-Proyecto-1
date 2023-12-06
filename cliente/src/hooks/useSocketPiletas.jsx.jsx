import React, { useContext, useEffect, useState } from "react";

import useDiaYHoraActual from "./UseDay";

import { useQueryClient } from "react-query";
import { useSocket } from "./useSocket";
import { baseUrl } from "../helpers/url";
import { AuthContext } from "../context/AuthContext";

function useSocketPiletas() {
  //estados de carga
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState({
    error: false,
    msg: "",
    usuario: null,
  });
  const [success, setSuccess] = useState({
    success: false,
    msg: "",
  });

  //CONEXION AL SOCKET
  const { socket, conectarSocket, desconectarSocket } = useSocket(baseUrl);
  const { horaActual, refetch } = useDiaYHoraActual();
  const queryClient = useQueryClient();

  const { auth } = useContext(AuthContext);
  useEffect(() => {
    if (auth.logged) {
      conectarSocket();
    }
  }, [auth, conectarSocket]);

  useEffect(() => {
    // Escuchar el evento "lista-usuarios" y actualizar el estado users
    const handleUserListUpdate = (updatedUsers) => {
      //crear un array en local storage con los usuarios que se van agregando
      setCargando(false);
      console.log(updatedUsers);

      if (!updatedUsers.ok) {
        setError({
          error: true,
          msg: updatedUsers.msg,
          usuario: updatedUsers.user,
        });
      } else {
        // quiero reiniciar el campo de nombre id con javascript
        refetch();

        queryClient.invalidateQueries("getUsrsByDate");

        setSuccess({
          success: true,
          msg: updatedUsers.user
            ? `Usuario registrado en  ${
                updatedUsers.user.activity
                  ? updatedUsers.user.activity[0].pileta
                  : "pileta de 50 mts"
              } correctamente`
            : "Usuario agregado en lista de turno siguiente correctamente",
        });
        setError({
          error: false,
          msg: "",
          nombre: "",
        });
      }
    };

    const handleCambiarTurno = (resp) => {
      if (resp.ok) {
        refetch();
      } else {
        setError({
          error: true,
          msg: resp.msg,
        });
      }
    };

    if (socket) {
      socket.on("lista-usuarios", handleUserListUpdate);
    }
    if (socket) {
      socket.on("lista-usuarios-siguiente-turno", handleUserListUpdate);
    }
    if (socket) {
      socket.on("autorizar", handleUserListUpdate);
    }
    if (socket) {
      if (socket) {
        socket.on("cambiar-turno", handleCambiarTurno);
      }
      return () => {
        if (socket) {
          socket.off("lista-usuarios", handleUserListUpdate);
          // socket.off("finalizar-turno", handleDeleteUsers);
        }
      };
    }
  }, [socket]);

  useEffect(() => {
    "me ejecute a las", horaActual + ":00";
    socket?.emit("cambiar-turno", {
      //quiero sumarle 1 a la hora actual
      horaActual: parseInt(horaActual) + ":00",
    });
  }, [horaActual]);

  useEffect(() => {
    if (error.error) {
      setCargando(false);
      setSuccess({
        success: false,
        msg: "",
      });

      setTimeout(() => {
        setError({
          error: false,
          msg: "",
          usuario: null,
        });
      }, 1500);
    }
  }, [error]);

  useEffect(() => {
    if (success.success) {
      setCargando(false);
      setError({
        error: false,
        msg: "",
        usuario: null,
      });

      setTimeout(() => {
        setSuccess({
          success: false,
          msg: "",
        });
      }, 1500);
    }
  }, [success]);

  return {
    socket,
    cargando,
    setCargando,
    error,
    setError,
    success,
    setSuccess,
  };
  //   <div className={style.body}>
  //     {data?.piletas.map((pileta, i) => (
  //       <div key={i}>
  //         <h2>
  //           {pileta.pileta.charAt(0).toUpperCase() + pileta.pileta.slice(1)}
  //         </h2>
  //         <div>total usuario : {pileta.users.length}</div>
  //         <Piletas
  //           key={i}
  //           pileta={pileta.pileta}
  //           users={pileta.users}
  //           horaActual={parseInt(horaActual) + ":00"}
  //         />
  //       </div>
  //     ))}
  //   </div>
  // );
}

export default useSocketPiletas;
