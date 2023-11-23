import React, { useContext, useEffect, useRef, useState } from "react";

import { useSocket } from "../../../hooks/useSocket";
import { AuthContext } from "../../../context/AuthContext";

import { baseUrl } from "../../../helpers/url";

import LayoutPiletas from "./piletas/LayoutPiletas";

import LayoutForm from "./formulario/LayoutForm";
import getUsersFromActivity from "../../../helpers/activitiesFetch/getUsersFromActivity";
import { useMutation, useQuery } from "react-query";

import style from "./inicio.module.css";
import Layout from "./tablaUsuariosTurnoActual/Layout";
import useDiaYHoraActual from "./UseDay";
import { getActivitiesByDate } from "../../../helpers/activitiesFetch/getActivitiesByDate";

function Inicio() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState({
    error: false,
    msg: "",
    nombre: "",
  });
  const [success, setSuccess] = useState({
    success: false,
    msg: "",
  });

  const getUsers = useQuery("getUsers", getUsersFromActivity);

  const usuarios = useQuery("getUsrsByDate", getActivitiesByDate);

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (getUsers.data) {
      setUserList(getUsers.data.userList);
    }
  }, [getUsers.data]);

  //CONEXION AL SOCKET
  const { socket, online, conectarSocket, desconectarSocket } =
    useSocket(baseUrl);
  const { auth } = useContext(AuthContext);
  useEffect(() => {
    if (auth.logged) {
      conectarSocket();
    }
  }, [auth, conectarSocket]);

  useEffect(() => {
    success;
    setTimeout(() => {
      setSuccess(false);
    }, 1000);
  }, [success]);

  useEffect(() => {
    setTimeout(() => {
      setError(false);
    }, 2000);
  }, [error]);

  const { horaActual, diaActualEnEspanol, data, refetch, isRefetching } =
    useDiaYHoraActual();

  return (
    <section className={style.body}>
      <div className={style.alert}>
        {cargando && (
          <div className="alert alert-warning">
            <h4 className="alert-heading">Cargando...</h4>
          </div>
        )}
        {success.success && (
          <div className="alert alert-success">
            <h4 className="alert-heading">{success.msg}</h4>
          </div>
        )}
        {error.error && (
          <div className="alert alert-danger">
            <h4 className="alert-heading">Error!</h4>
            <p>{error.msg}</p>
          </div>
        )}
      </div>

      <button className={style.button}>Agregar Usuario</button>

      <main className={style.main}>
        <Layout socket={socket} setCargando={setCargando} usuarios={usuarios} />
      </main>

      <aside className={style.aside}>
        <LayoutForm
          socket={socket}
          setCargando={setCargando}
          userList={userList}
        />
      </aside>

      <div className={style.footer}>
        <LayoutPiletas
          socket={socket}
          setCargando={setCargando}
          setError={setError}
          setSuccess={setSuccess}
          usuarios={usuarios}
        />
      </div>
    </section>
  );
}

export default Inicio;
