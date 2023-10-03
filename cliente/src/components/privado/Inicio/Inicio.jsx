import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useSocket } from "../../../hooks/useSocket";
import { AuthContext } from "../../../context/AuthContext";

import TablaUsuarios from "./TablaUsuarios";
import BuscarUsuariosForm from "./AgregarUsuarios/Formulario";
import getAllPiletas from "../../../helpers/piletasFetch";

import { baseUrl } from "../../../helpers/url";
import Modal from "./modal/Modal";
import { getUser } from "../../../helpers/getUsers";
import User from "../UserInfo/User";
import FormularioInicioDia from "./empezarHorario/FormularioInicioDia";

import style from "./inicio.module.css";

import useHook from "./socket/sokcet";

const fetchHours = async () => {
  const res = await fetch(baseUrl + "hour/getAll");
  const data = await res.json();
  return data;
};

function Inicio() {
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: "hours",
    queryFn: fetchHours,
  });

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

  const { socket, online, conectarSocket, desconectarSocket } =
    useSocket(baseUrl);
  const { auth } = useContext(AuthContext);

  const [args, setArgs] = useState({
    date: "",
    hourStart: "",
    hourFinish: "",
    idUser: "",
  });

  const [pileta25, setPileta25] = useState([]);
  const [pileta50, setPileta50] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    msg: "",
    nombre: "",
  });

  const [inicioHorario, setInicioHorario] = useState({
    status: false,
    hourStart: "",
    hourFinish: "",
    date: "",
  });
  const [usersRegistered, setUsersRegistered] = useState([]);

  useEffect(() => {}, [inicioHorario]);

  //cargar informacion de piletas

  const { data: dataPiletas, isLoading: cargo } = useQuery({
    queryKey: ["piletas"],
    queryFn: getAllPiletas,
  });

  useEffect(() => {
    if (!cargo && dataPiletas.piletas.length) {
      if (dataPiletas.piletas[0] && dataPiletas.piletas[0].users.length > 0) {
        dataPiletas.piletas[0].pileta === "pileta 50"
          ? setPileta50(dataPiletas.piletas[0].users)
          : setPileta25(dataPiletas.piletas[0].users);
      }
      if (dataPiletas.piletas[1] && dataPiletas.piletas[1].users.length > 0) {
        dataPiletas.piletas[1].pileta === "pileta 50"
          ? setPileta50(dataPiletas.piletas[1].users)
          : setPileta25(dataPiletas.piletas[1].users);
      }
    }
    //
    //
  }, [dataPiletas, cargo]);

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

  const handleChange = (e) => {
    const selectedValue = JSON.parse(e.target.value); // Parse the JSON string
    setArgs({
      ...args,
      hourStart: selectedValue.hourStart,
      hourFinish: selectedValue.hourFinish,
    });
  };

  const handleEnd = () => {
    socket?.emit("finalizar-turno");
    setInicioHorario(false);
  };

  if (isLoading) return <h1>Cargando...</h1>;

  if (getUserById.isLoading || getUserById.isSuccess) {
    return <User getUserById={getUserById} />;
  }

  return (
    <div className={style.body}>
      {/* cargar usuarios */}

      {!inicioHorario.status &&
      pileta25.length === 0 &&
      pileta50.length === 0 ? (
        <>
          <section className={style.formBodyInicio}>
            <FormularioInicioDia
              data={data}
              setInicioHorario={setInicioHorario}
              setUsersRegistered={setUsersRegistered}
            />
          </section>
        </>
      ) : usersRegistered.length > 0 ? (
        <>
          <section className={style.formBody}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div>
                <span className="fw-bold">Horario:</span>
                {inicioHorario.hourStart} - {inicioHorario.hourFinish}
              </div>

              <div>
                <span className="fw-bold"> Dia:</span> {inicioHorario.date}
              </div>
            </div>
            <hr />
            <BuscarUsuariosForm
              args={args}
              setArgs={setArgs}
              handleChange={handleChange}
              socket={socket}
              loading={loading}
              error={error}
              setLoading={setLoading}
              setError={setError}
              usersRegistered={usersRegistered}
            />

            <button
              type="button"
              className={`btn btn-lg btn-warning ${style.buttonEnd}`}
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Finalizar Turno
            </button>
          </section>
          <Modal handleEnd={handleEnd} />

          {/* usuario en el ambiente */}

          <TablaUsuarios
            pileta25={pileta25}
            pileta50={pileta50}
            getUserById={getUserById}
          />
        </>
      ) : (
        <div>
          <h1>No hay usuarios registrados en este horario</h1>
          <button
            className="btn btn-danger"
            onClick={() => {
              setInicioHorario({
                status: false,
                hourStart: "",
                hourFinish: "",
                date: "",
              });
              setPileta25([]);
              setPileta50([]);
            }}
          >
            Volver
          </button>
        </div>
      )}
    </div>
  );
}

export default Inicio;
