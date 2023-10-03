// BuscarUsuariosForm.js
import React, { useEffect, useState } from "react";

import style from "./style.module.css";
import TableUsers from "./TableUsers";

function BuscarUsuariosForm({
  args,
  setArgs,
  socket,
  usersRegistered,
  loading,
  error,
  setLoading,
  setError,
}) {
  //buscar usuarios por el cusstomId

  const [idUser, setIdUser] = useState("");

  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);
  useEffect(() => {}, [error, loading, showTable]);

  const onSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    if (idUser === "") {
      return;
    }
    const isUserExist = usersRegistered[0].find(
      (user) => user.customId == idUser
    );

    if (!isUserExist) {
      setError({ error: true, msg: "Usuario no encontrado" });
      setLoading(false);

      setTimeout(() => {
        setError({ error: false, msg: "" });
      }, 1500);
      return;
    }
    setError({ error: false, msg: "" });

    socket?.emit("agregar-usuario", { args: isUserExist });
  };

  return (
    <>
      {!showTable ? (
        <>
          <h1>Agregar Usuarios</h1>
          <form onSubmit={onSubmit} style={{ padding: "40px" }}>
            <div>
              <input
                type="text"
                name="id"
                id="id"
                value={idUser}
                placeholder="Insertar Id Usuario"
                className="form-control"
                onChange={(e) => {
                  setIdUser(e.target.value);
                  setArgs({ ...args, idUser: e.target.value });
                }}
              />
            </div>

            {loading && (
              <div className="spinner-border text-primary mt-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
            {error.error && (
              <>
                <h4>{error.msg}</h4>
              </>
            )}
            <button
              type="submit"
              className="btn btn-lg btn-success mt-3"
              disabled={idUser === ""}
            >
              Buscar
            </button>
          </form>
          <p className={style.linkToTable} onClick={() => setShowTable(true)}>
            Ver tabla de usuarios
          </p>
        </>
      ) : (
        <>
          <button
            className="btn btn-danger"
            onClick={() => setShowTable(false)}
            style={{
              display: "block",
              marginLeft: "auto",
              width: "fit-content",
            }}
          >
            X
          </button>
          <TableUsers userRegistered={usersRegistered} />
        </>
      )}
    </>
  );
}

export default BuscarUsuariosForm;
