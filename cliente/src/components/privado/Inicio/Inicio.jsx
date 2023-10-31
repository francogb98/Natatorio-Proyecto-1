import React, { useContext, useEffect, useRef, useState } from "react";

import { useSocket } from "../../../hooks/useSocket";
import { AuthContext } from "../../../context/AuthContext";

import { baseUrl } from "../../../helpers/url";

import useDiaYHoraActual from "./UseDay";
import FormularioTurnoSiguiente from "./FormularioTurnoSiguiente";
import FormularioPrueba from "./FormularioPrueba";
import Piletas from "./Piletas";

import { reinicarPileta } from "../../../helpers/piletas/reiniciarPileta";

function Inicio() {
  //traigo el dia, la hora, las piletas
  const { horaActual, diaActualEnEspanol, data, refetch, isRefetching } =
    useDiaYHoraActual();

  // -----------------Estados-----------------
  const [error, setError] = useState({
    error: false,
    msg: "",
    nombre: "",
  });
  const [success, setSuccess] = useState({
    success: false,
    msg: "",
  });
  const [loading, setLoading] = useState(false);
  const [cambiandoTurno, setCambiandoTurno] = useState({
    status: false,
    msg: "",
  });

  //obtengo todas las actividades del dia que esten en este horario
  //obtengo todas las piletas en este horario
  useEffect(() => {}, [horaActual, diaActualEnEspanol]);

  // -----------------Socket-----------------
  const { socket, online, conectarSocket, desconectarSocket } =
    useSocket(baseUrl);
  const { auth } = useContext(AuthContext);
  useEffect(() => {
    if (auth.logged) {
      conectarSocket();
    }
  }, [auth, conectarSocket]);

  // ----------------------Escuchar eventos del socket----------------------

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

  // -----------------Registrar Uusario Turno Actual-----------------
  const registrarUsuario = (id) => {
    setLoading(true);
    socket?.emit("agregar-usuario", {
      id,
      horaActual: horaActual + ":00",
      HoraFinalTurno: parseInt(horaActual) + 1 + ":00",
      dia: diaActualEnEspanol,
    });
  };
  // -----------------Registrar Uusario Turno Siguiente-----------------
  const registrarUsuarioTurnoSiguiente = ({ id }) => {
    setLoading(true);
    socket?.emit("agregar-usuario-turno-siguiente", {
      id,
      horaSiguienteTurno: parseInt(horaActual) + 1 + ":00",
      dia: diaActualEnEspanol,
    });
  };

  //-----------------------Finalizar turno y Cambiar de horario -----------------------
  const handleEnd = () => {
    console.log("me ejecute a las", horaActual + ":00");
    setCambiandoTurno({
      status: true,
      msg: "Cargando turno por favor espere...",
    });
    socket?.emit("cambiar-turno", {
      horaActual: horaActual + ":00",
    });
  };

  //-----------se ejecutara cuando se cambie la hora, solo si la hora es distinta------

  const [horaAnterior, setHoraAnterior] = useState(horaActual);

  useEffect(() => {
    if (horaActual !== horaAnterior) {
      console.log("cambio la hora");
      handleEnd();
    }
    setHoraAnterior(horaActual);
  }, [horaActual]);

  // -----------------Actualizar data de tabla y loading-----------------

  useEffect(() => {
    if (loading && !isRefetching) {
      setLoading(isRefetching);
    }
    if (success.success && !isRefetching) {
      setTimeout(() => {
        setSuccess({ success: false, msg: "" });
      }, 1000);
    }
    if (cambiandoTurno && !isRefetching) {
      setCambiandoTurno({ status: false, msg: "" });
    }
  }, [isRefetching]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        width: "100%",
      }}
    >
      {cambiandoTurno.status ? (
        <h1 className={"text-danger"}>{cambiandoTurno.msg}</h1>
      ) : (
        // <h1 className="text-danger">Cambiando turno por favor espere...</h1>
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            <h1>Inicio</h1>
            <h4>{diaActualEnEspanol}</h4>
            <button onClick={handleEnd}>cambiarTurno</button>
            <h4>
              Turno Actual {parseFloat(horaActual)}:00 -{" "}
              {parseFloat(horaActual) + 1}:00
            </h4>
            {loading && <h1>Cargando...</h1>}
            {!loading && error.error && (
              <h3
                className="alert alert-danger"
                role="alert"
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  marginRight: "20px",
                  width: "fit-content",
                  textAlign: "center",
                }}
              >
                {error.msg}
              </h3>
            )}
            {!loading && success.success && (
              <h4
                className="alert alert-success "
                role="alert"
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  marginRight: "20px",
                  width: "fit-content",
                  textAlign: "center",
                }}
              >
                {success.msg}
              </h4>
            )}

            <FormularioPrueba registrarUsuario={registrarUsuario} />
            <FormularioTurnoSiguiente
              registrarUsuarioTurnoSiguiente={registrarUsuarioTurnoSiguiente}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginTop: "30px",
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
        </>
      )}
    </div>
  );
}
export default Inicio;
