import React, { useContext, useEffect, useState } from "react";
import { useSocket } from "../../../hooks/useSocket";
import { AuthContext } from "../../../context/AuthContext";
import TablaUsuarios from "../Inicio/TablaUsuarios";

import { useMutation, useQuery } from "react-query";

import { baseUrl } from "../../../helpers/url";
import getAllPiletas from "../../../helpers/piletasFetch";
import { getUser } from "../../../helpers/getUsers";
import User from "../UserInfo/User";

function Piletas() {
  const { socket, online, conectarSocket, desconectarSocket } =
    useSocket(baseUrl);
  const { auth } = useContext(AuthContext);

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

  const [pileta25, setPileta25] = useState([]);
  const [pileta50, setPileta50] = useState([]);
  const [finalizando, setFinalizando] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["piletas"],
    queryFn: getAllPiletas,
  });

  useEffect(() => {
    if (!isLoading && data.piletas.length) {
      console.log(data.piletas[0]);
      if (data.piletas[0] && data.piletas[0].users.length > 0) {
        data.piletas[0].pileta === "pileta 50"
          ? setPileta50(data.piletas[0].users)
          : setPileta25(data.piletas[0].users);
      }
      if (data.piletas[1] && data.piletas[1].users.length > 0) {
        data.piletas[1].pileta === "pileta 50"
          ? setPileta50(data.piletas[1].users)
          : setPileta25(data.piletas[1].users);
      }
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (auth.logged) {
      conectarSocket();
    }
  }, [auth, conectarSocket]);

  useEffect(() => {
    // Escuchar el evento "lista-usuarios" y actualizar el estado users

    const handleUserListUpdate = (updatedUsers) => {
      //   setPileta50(updatedUsers.pileta50);
      //   setPileta25(updatedUsers.pileta25);

      if (!updatedUsers.ok) {
        return;
      } else {
        if (updatedUsers.result.pileta === "pileta 50") {
          setPileta50(updatedUsers.result.users);
        }
        if (updatedUsers.result.pileta === "pileta 25") {
          setPileta25(updatedUsers.result.users);
        }
      }
    };

    const handleDeleteUsers = () => {
      setFinalizando(true);

      setTimeout(() => {
        setFinalizando(false);
        setPileta50([]);
        setPileta25([]);
      }, 3000);
    };

    if (socket) {
      socket.on("lista-usuarios", handleUserListUpdate);
    }
    if (socket) {
      socket.on("finalizar-turno", handleDeleteUsers);
    }

    return () => {
      if (socket) {
        socket.off("lista-usuarios", handleUserListUpdate);
        socket.off("finalizar-turno", handleDeleteUsers);
      }
    };
  }, [socket]);

  if (getUserById.isLoading || getUserById.isSuccess) {
    return <User getUserById={getUserById} />;
  }

  return (
    <div>
      {finalizando && (
        <div className="alert alert-danger">
          <h1>Finalizando turno...</h1>
        </div>
      )}

      <TablaUsuarios
        pileta25={pileta25}
        pileta50={pileta50}
        getUserById={getUserById}
      />
    </div>
  );
}

export default Piletas;
