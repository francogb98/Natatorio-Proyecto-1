import React from "react";
import { useMutation, useQueryClient } from "react-query";

import { useEffect, useState } from "react";

import { agregarUsuarioApileta } from "../../../../helpers/piletas/agregarUsuarioApileta.js";

import { baseUrl } from "../../../../helpers/url.js";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

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

function FormularioBuscarUsuario() {
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

  useEffect(() => {
    console.log(userEncontardo);
  }, [userEncontardo]);

  const agregarUsuario = useMutation({
    mutationFn: agregarUsuarioApileta,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          title: "Usuario agregado",
          icon: "success",
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
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #000",
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <label htmlFor="" className="form-label fw-bold">
          Buscar Usuario
        </label>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="form-control"
        />
        <button type="submit" className="btn btn-success mt-1">
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
            {!buscarUsuario.data.user.activity ? (
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
            {buscarUsuario.data.user.status && (
              <button
                className="btn btn-sm btn-success ms-3"
                onClick={() => {
                  agregarUsuario.mutate(buscarUsuario.data.user.customId);
                }}
              >
                Agregar
              </button>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default FormularioBuscarUsuario;
