import React, { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";

import { useEffect, useState } from "react";

import { agregarUsuarioApileta } from "../../../../helpers/piletas/agregarUsuarioApileta.js";

import { baseUrl } from "../../../../helpers/url.js";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../../../context/AuthContext.jsx";

const getUser = async (id) => {
  const res = await fetch(`${baseUrl}user/searchUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();

  return data;
};

const agregarUsuarioAlTurno = async (content) => {
  // es la peticion de arriba pero es un patch y tengo que enviar un body
  const res = await fetch(`${baseUrl}pileta`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
  const data = await res.json();
  return data;
};

const agregarUsuarioAlistaAutorizados = async (content) => {
  // es la peticion de arriba pero es un patch y tengo que enviar un body
  const res = await fetch(`${baseUrl}autorizado`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
  const data = await res.json();
  return data;
};

const autorizarUsuaRIO = async (content) => {
  // es la peticion de arriba pero es un patch y tengo que enviar un body
  const res = await fetch(`${baseUrl}pileta/autorizar`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
  const data = await res.json();
  return data;
};

function FormularioBuscarUsuario() {
  const { auth } = useContext(AuthContext);

  const [id, setId] = useState("");
  const [userEncontardo, setUserEncontrado] = useState(false);

  const queryClient = useQueryClient();

  const buscarUsuario = useMutation(getUser, {
    onSuccess: (data) => {
      if (data.status == "success") {
        setUserEncontrado(true);
      }
    },
  });

  useEffect(() => {}, [userEncontardo]);

  const agregarUsuarioAListaAutorizado = useMutation({
    mutationFn: agregarUsuarioAlistaAutorizados,
    onSuccess: (data) => {
      Swal.fire({
        title: "Usuario agregado",
        icon: "success",
        text: data.message,
        confirmButtonText: "Aceptar",
      });
      queryClient.invalidateQueries("lista_autorizados");
    },
  });
  const agregarUsuario = useMutation({
    mutationFn: agregarUsuarioAlTurno,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          title: "Usuario agregado",
          icon: "success",
          text: data.message,
          confirmButtonText: "Aceptar",
        });
      }
      if (data.status === "error") {
        Swal.fire({
          title: "Usuario ya agregado",
          icon: "error",
          text: data.message,
          confirmButtonText: "Aceptar",
        });
      }
      queryClient.invalidateQueries("getUsrsByDate");
      queryClient.invalidateQueries("piletas");
    },
  });
  const autorizar = useMutation({
    mutationFn: autorizarUsuaRIO,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          title: "Usuario agregado",
          icon: "success",
          text: data.message,
          confirmButtonText: "Aceptar",
        });
      }
      if (data.status === "error") {
        Swal.fire({
          title: "Usuario ya agregado",
          icon: "error",
          text: data.message,
          confirmButtonText: "Aceptar",
        });
      }
      queryClient.invalidateQueries("piletas");
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    buscarUsuario.mutate(id);
  };
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <form
        action=""
        onSubmit={handleSearch}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #000",
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: "#f5f5f5",
          width: "100%",
        }}
      >
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="form-control"
          placeholder="buscar usuario por su id..."
        />
        <button type="submit" className="btn btn-success  ms-3">
          Buscar
        </button>
      </form>
      {buscarUsuario.isLoading ? <h3>Buscando usuario...</h3> : null}
      {buscarUsuario.data?.status === "error" ? (
        <h3>{buscarUsuario.data.message}</h3>
      ) : null}
      {buscarUsuario.data?.status === "success" && userEncontardo ? (
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">
              <Link to={`/admin/panel/usuario/${buscarUsuario.data.user._id}`}>
                {buscarUsuario.data.user.nombre}{" "}
                {buscarUsuario.data.user.apellido}
              </Link>
            </h5>
            <h6 className="card-subtitle mb-2 text-body-secondary">
              {buscarUsuario.data.user.customId}
            </h6>
            {!buscarUsuario.data.user.activity ||
            !buscarUsuario.data.user.activity.length ? (
              <p className="card-text">No tiene actividad registrada</p>
            ) : (
              <>
                <p className="card-text">
                  <b>{buscarUsuario.data.user.activity[0].name}</b>/
                  <b>{buscarUsuario.data.user.activity[0].hourStart}</b>-
                  <b>{buscarUsuario.data.user.activity[0].hourFinish}</b>
                </p>
                <p className="card-text">
                  <b>{buscarUsuario.data.user.activity[0].date.join(" - ")}</b>
                </p>
                <p
                  className={`card-text ${
                    buscarUsuario.data.user.status
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  <b>
                    {buscarUsuario.data.user.status
                      ? "Habilitado"
                      : "Esperando Habilitacion"}
                  </b>
                </p>
              </>
            )}
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                setUserEncontrado(false);
              }}
            >
              Cerrar
            </button>
            {buscarUsuario.data.user.status &&
              (auth.role === "SUPER_ADMIN" ||
                auth.role === "ADMINISTRATIVO") && (
                <button
                  className="btn btn-sm btn-success ms-3"
                  onClick={() => {
                    agregarUsuario.mutate({
                      customId: buscarUsuario.data.user.customId,
                      nombre: buscarUsuario.data.user.nombre,
                      actividad: buscarUsuario.data.user.activity[0].name,
                      pileta: buscarUsuario.data.user.activity[0].pileta,
                      horarioSalida:
                        buscarUsuario.data.user.activity[0].hourFinish,
                    });
                  }}
                >
                  Agregar
                </button>
              )}
            {auth.role === "SUPER_ADMIN" && (
              <>
                <button
                  className="btn btn-sm btn-warning ms-3"
                  onClick={() => {
                    autorizar.mutate({ id: buscarUsuario.data.user.customId });
                  }}
                >
                  Autorizar
                </button>
                <button
                  className="btn btn-sm btn-secondary ms-3 mt-2 me-3"
                  onClick={() => {
                    agregarUsuarioAListaAutorizado.mutate({
                      user: buscarUsuario.data.user._id,
                    });
                  }}
                >
                  Agregar a lista
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default FormularioBuscarUsuario;
