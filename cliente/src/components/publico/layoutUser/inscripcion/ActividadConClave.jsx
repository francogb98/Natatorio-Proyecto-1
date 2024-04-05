import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../helpers/url";

const getActividadPorClave = async (clave) => {
  try {
    const url = `${baseUrl}activity/getActividad/${clave}`;
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
    });
    const resultado = await resp.json();

    return resultado;
  } catch (error) {
    return error;
  }
};

function ActividadConClave({ registerInActivity }) {
  const [actividadConClave, setActividadConClave] = useState(null);
  const [clave, setClave] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);
  const [intentosRestantes, setIntentosRestantes] = useState(3);
  const [bloqueado, setBloqueado] = useState(false);

  useEffect(() => {
    const intentosGuardados = localStorage.getItem("intentosRestantes");
    if (intentosGuardados) {
      setIntentosRestantes(parseInt(intentosGuardados));
    }
    const bloqueadoGuardado = localStorage.getItem("bloqueado");
    if (bloqueadoGuardado) {
      setBloqueado(bloqueadoGuardado === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("intentosRestantes", intentosRestantes);
    localStorage.setItem("bloqueado", bloqueado);
  }, [intentosRestantes, bloqueado]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 1500);
    }
  }, [error]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (intentosRestantes === 0) {
      setBloqueado(true);
      return;
    }
    setCargando(true);
    const result = await getActividadPorClave(clave);
    if (result.status && result.status == "error") {
      setIntentosRestantes(intentosRestantes - 1);
      setCargando(false);
      if (intentosRestantes === 1) {
        setBloqueado(true);
      }
      return setError(true);
    }
    setActividadConClave(result);
    setCargando(false);
  }

  return (
    <div>
      <h4>
        {" "}
        Incripcion a actividad especial (Equipo de Competicion / Profesorado /
        Natacion Artistica){" "}
      </h4>
      {cargando && (
        <div className="spinner-border text-primary mt-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}

      {actividadConClave && (
        <div
          className="card"
          style={{ width: "250px", fontSize: "20px", margin: "20px auto" }}
        >
          <div className="card-body">
            <h5 className="card-title mb-3">{actividadConClave.name}</h5>
            <h6 className="card-subtitle mb-2 text-body-secondary">
              {actividadConClave.hourStart} - {actividadConClave.hourFinish}
            </h6>
            <p className="card-text">{actividadConClave.date?.join(" - ")}</p>
            <button
              className="btn btn-danger me-3"
              onClick={() => {
                setActividadConClave(null);
              }}
            >
              Cerrar
            </button>
            <button
              className="btn btn-success"
              onClick={() => {
                registerInActivity.mutate({
                  idActividad: actividadConClave._id,
                });
              }}
            >
              Registrarse
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mx-auto" style={{ width: "50%" }}>
          Actividad no Encontrada
        </div>
      )}

      {bloqueado && (
        <div className="alert alert-danger mx-auto" style={{ width: "50%" }}>
          Has excedido el número máximo de intentos. Inténtalo de nuevo más
          tarde.
        </div>
      )}

      <form
        action=""
        style={{
          width: "40%",
          margin: "20px auto",
          display: "flex",
          justifyContent: "center",
        }}
        onSubmit={handleSubmit}
      >
        <input
          type="number"
          placeholder="Ingrese codigo de acceso"
          className="form-control"
          style={{
            width: "120px",
          }}
          value={clave}
          onChange={(e) => {
            setClave(e.target.value);
          }}
        />
        <button
          type="submit"
          className="btn btn-lg ms-1 btn-warning"
          disabled={bloqueado}
        >
          Buscar
        </button>
      </form>
    </div>
  );
}

export default ActividadConClave;
