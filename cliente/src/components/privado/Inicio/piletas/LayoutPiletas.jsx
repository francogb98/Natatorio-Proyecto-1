import React, { useEffect } from "react";

import style from "./style.module.css";

import Piletas from "./Piletas/";
import useDiaYHoraActual from "../UseDay";

import { useQueryClient } from "react-query";

function LayoutPiletas({
  socket,
  setCargando,
  setError,
  setSuccess,
  usuarios,
}) {
  const {
    horaActual,
    diaActualEnEspanol,
    data,
    refetch,
    isRefetching,
    minutoActual,
  } = useDiaYHoraActual();

  const queryClient = useQueryClient();

  useEffect(() => {
    // Escuchar el evento "lista-usuarios" y actualizar el estado users
    const handleUserListUpdate = (updatedUsers) => {
      setCargando(false);
      if (!updatedUsers.ok) {
        setError({
          error: true,
          msg: updatedUsers.msg,
          nombre: updatedUsers.user ? updatedUsers.user.nombre : "null",
        });
      } else {
        // quiero reiniciar el campo de nombre id con javascript
        refetch();

        queryClient.invalidateQueries("getUsrsByDate");

        setSuccess({
          success: true,
          msg: updatedUsers.user
            ? `Usuario registrado en  ${updatedUsers.user.activity[0].pileta} correctamente`
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
      socket.on("lista-usuarios-siguient-turno", handleUserListUpdate);
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

  return (
    <div className={style.body}>
      {data?.piletas.map((pileta, i) => (
        <div key={i}>
          <h2>
            {pileta.pileta.charAt(0).toUpperCase() + pileta.pileta.slice(1)}
          </h2>
          <div>total usuario : {pileta.users.length}</div>
          <Piletas
            key={i}
            pileta={pileta.pileta}
            users={pileta.users}
            horaActual={parseInt(horaActual) + ":00"}
          />
        </div>
      ))}
    </div>
  );
}

export default LayoutPiletas;
