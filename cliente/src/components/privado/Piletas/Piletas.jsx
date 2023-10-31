import React, { useContext, useEffect, useState } from "react";
import { useSocket } from "../../../hooks/useSocket";
import { AuthContext } from "../../../context/AuthContext";
import TablaUsuarios from "../Inicio/TablaUsuarios";

import { useMutation, useQuery } from "react-query";

import { baseUrl } from "../../../helpers/url";
import getAllPiletas from "../../../helpers/piletasFetch";
import { getUser } from "../../../helpers/getUsers";
import User from "../UserInfo/User";
import useDiaYHoraActual from "../Inicio/UseDay";

function Piletas() {
  const { socket, online, conectarSocket, desconectarSocket } =
    useSocket(baseUrl);
  const { auth } = useContext(AuthContext);

  const { data, isRefetching, refetch } = useDiaYHoraActual();

  const getUserById = useMutation({
    mutationFn: getUser,
    onSuccess: (data) => {
      if (data.status == "error") {
        setTimeout(() => {
          getUserById.reset();
        }, 3000);
      }
    },
  });

  const [finalizando, setFinalizando] = useState(false);

  useEffect(() => {
    if (auth.logged) {
      conectarSocket();
    }
  }, [auth, conectarSocket]);

  useEffect(() => {
    // Escuchar el evento "lista-usuarios" y actualizar el estado users
    const handleUserListUpdate = (updatedUsers) => {
      setLoading(false);
      console.log(updatedUsers);
      if (!updatedUsers.ok) {
        setError({
          error: true,
          msg: updatedUsers.msg,
          nombre: updatedUsers.user ? updatedUsers.user.nombre : "null",
        });
        setTimeout(() => {
          setError({
            error: false,
            msg: "",
            nombre: "",
          });
        }, 2000);
      } else {
        // quiero reiniciar el campo de nombre id con javascript
        refetch();
        setSuccess({
          success: true,
          msg: `Usuario registrado en ${updatedUsers.user.activity[0].pileta} correctamente`,
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
        setTimeout(() => {
          setError({
            error: false,
            msg: "",
            nombre: "",
          });
        }, 2000);
      }
    };

    if (socket) {
      socket.on("lista-usuarios", handleUserListUpdate);
    }
    if (socket) {
      socket.on("lista-usuarios-siguient-turno", handleUserListUpdate);
    }
    if (socket) {
      if (socket) {
        socket.on("cambiar-turno", handleCambiarTurno);
      }
      // if (socket) {
      //   socket.on("finalizar-turno", handleDeleteUsers);
      // }

      return () => {
        if (socket) {
          socket.off("lista-usuarios", handleUserListUpdate);
          // socket.off("finalizar-turno", handleDeleteUsers);
        }
      };
    }
  }, [socket]);

  if (getUserById.isLoading || getUserById.isSuccess) {
    return <User getUserById={getUserById} />;
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {data?.piletas.map((pileta, i) => {
        // creo un componenete que se llame piletas al cual le voy a pasar, nombre de pileta y usuarios
        return (
          <div style={{ minWidth: "450px" }}>
            <div>
              <h3>{pileta.pileta}</h3>
              <button
                onClick={() => {
                  reinicarPileta(pileta.pileta);
                }}
              >
                reiniciar
              </button>
            </div>
            <Piletas
              key={i}
              pileta={pileta.pileta}
              users={pileta.users}
              refetch={refetch}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Piletas;
