import React, { useContext, useEffect, useState } from "react";
import { useSocket } from "../../../../hooks/useSocket";
import { baseUrl } from "../../../../helpers/url";
import { AuthContext } from "../../../../context/AuthContext";

function useHook() {
  const [pileta25, setPileta25] = useState([]);
  const [pileta50, setPileta50] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    error: false,
    msg: "",
    nombre: "",
  });

  const { socket, online, conectarSocket, desconectarSocket } =
    useSocket(baseUrl);
  const { auth } = useContext(AuthContext);

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
      setLoading(false);

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
        }, 3000);
      } else {
        // quiero reiniciar el campo de nombre id con javascript
        setIdUser("");

        if (updatedUsers.result.pileta === "pileta 50") {
          setPileta50(updatedUsers.result.users);
        }
        if (updatedUsers.result.pileta === "pileta 25") {
          setPileta25(updatedUsers.result.users);
        }
        setError({
          error: false,
          msg: "",
          nombre: "",
        });
      }
    };

    const handleDeleteUsers = () => {
      setPileta50([]);
      setPileta25([]);
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

  //quiero devolver todos los datos para usarlo como un hook

  return {
    pileta25,
    pileta50,
    loading,
    error,
    setError,
    setLoading,
    setPileta25,
    setPileta50,
    socket,
  };
}

export default useHook;
