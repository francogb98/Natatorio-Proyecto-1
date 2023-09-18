import React, { useContext, useEffect, useState } from "react";
import style from "./inicio.module.css";
import { useMutation, useQuery } from "react-query";
import { useSocket } from "../../../hooks/useSocket";
import { AuthContext } from "../../../context/AuthContext";
import TablaUsuarios from "./TablaUsuarios";

import BuscarUsuariosForm from "./Formulario";
import getAllPiletas from "../../../helpers/piletasFetch";

import { baseUrl } from "../../../helpers/url";
import Modal from "./Modal";
import { getUser } from "../../../helpers/getUsers";
import User from "../searchUser/User";

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
  const [idUser, setIdUser] = useState("");
  const [pileta25, setPileta25] = useState([]);
  const [pileta50, setPileta50] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    msg: "",
    nombre: "",
  });

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
        setIdUser("");
        console.log(updatedUsers.result);
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

  const onSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    if (
      args.date === "" ||
      args.hourStart === "" ||
      args.hourFinish === "" ||
      idUser === ""
    ) {
      setLoading(false);
      setError({
        error: true,
        msg: "Faltan campos por completar",
        nombre: "",
      });
      setTimeout(() => {
        setError({
          error: false,
          msg: "",
          nombre: "",
        });
      }, 3000);
      return;
    }

    socket?.emit("agregar-usuario", { args });
  };

  const handleEnd = () => {
    socket?.emit("finalizar-turno");
  };

  if (isLoading) return <h1>Cargando...</h1>;

  if (getUserById.isLoading || getUserById.isSuccess) {
    return <User getUserById={getUserById} />;
  }
  return (
    <div className={style.body}>
      {/* cargar usuarios */}

      <section className={style.formBody}>
        <h1>Agregar Usuarios</h1>
        <BuscarUsuariosForm
          args={args}
          setArgs={setArgs}
          handleChange={handleChange}
          idUser={idUser}
          setIdUser={setIdUser}
          onSubmit={onSubmit}
          loading={loading}
          error={error}
          data={data}
        />

        <button
          type="button"
          className={`btn btn-lg btn-warning ${style.buttonEnd}`}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Finalizar Turno
        </button>

        <Modal handleEnd={handleEnd} />
      </section>

      {/* usuario en el ambiente */}

      <TablaUsuarios
        pileta25={pileta25}
        pileta50={pileta50}
        getUserById={getUserById}
      />
    </div>
  );
}

export default Inicio;
