import { useMutation, useQueryClient } from "react-query";
import avatar from "../../../../../assets/avatar.webp";
import LiElement from "./LiElement";
import { UserFetchPrivado } from "../../../../../helpers/UserFetchConClases/FETCH-privado/UserFetch-Privado";
import { HabilitarUsuario } from "../../../../../helpers/usersFetch/HabilitarUsuario";

import { toast } from "sonner";
import Swal from "sweetalert2";
import { useState } from "react";

function calcular_fecha(fecha_carga) {
  // Convertir la cadena de fecha en un objeto de fecha
  var partesFecha = fecha_carga.split("/");

  // Crear el objeto de fecha
  var fecha = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
  // Obtener la fecha actual
  var fechaActual = new Date();

  fecha.setMonth(fecha.getMonth() + 1);

  // Calcular la diferencia en milisegundos
  var diferenciaMilisegundos = fechaActual - fecha;

  // Convertir la diferencia de milisegundos a días
  var diasPasados = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

  return diasPasados;
}

function UserCard({ user, type }) {
  const [send, setSend] = useState(false);
  const [isDenegeted, setIsDenegeted] = useState(false);
  const [formData, setFormData] = useState({ asunto: "", cuerpo: "" });

  const queryClient = useQueryClient();

  const enviarNotificacion = useMutation({
    mutationFn: UserFetchPrivado.sendNotificacion,
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("Notificación enviada");
        setSend(false); // Ocultar el formulario después de enviar
        setFormData({ asunto: "", cuerpo: "" }); // Limpiar el formulario
      } else {
        toast.error("Error al enviar la notificación");
      }
      queryClient.invalidateQueries("getUserData");
      queryClient.invalidateQueries("users-list");
    },
  });

  const aceptarUsuario = useMutation({
    mutationFn: HabilitarUsuario,
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("Usuario habilitado");
        queryClient.invalidateQueries("users-list");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo salió mal",
        });
      }
    },
  });

  const denegarUsuario = useMutation({
    mutationFn: UserFetchPrivado.inhabilitarUsuario,
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("Usuario Inhabilitado");
        queryClient.invalidateQueries("getUserData");
        queryClient.invalidateQueries("users-list");
      } else {
        toast.error(data.message);
      }
    },
  });
  const darDeBajaRevision = useMutation({
    mutationFn: UserFetchPrivado.darDeBajaPorRevision,
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("Usuario Inhabilitado");
        queryClient.invalidateQueries("getUserData");
        queryClient.invalidateQueries("users-list");
      } else {
        toast.error(data.message);
      }
    },
  });
  const darDeBaja = useMutation({
    mutationFn: UserFetchPrivado.darDeBajaPorCertificado,
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("Usuario Inhabilitado");
        queryClient.invalidateQueries("getUserData");
        queryClient.invalidateQueries("users-list");
      } else {
        toast.error(data.message);
      }
    },
  });

  const handleSendNotification = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (!formData.get("asunto").trim() || !formData.get("cuerpo").trim()) {
      toast.error("Por favor, completa ambos campos.");
      return;
    }
    const content = {
      id: user._id,
      asunto: formData.get("asunto"),
      cuerpo: formData.get("cuerpo"),
    };

    toast.info("Enviando mensaje");
    enviarNotificacion.mutate(content);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (type === "certificado") {
      darDeBaja.mutate({
        id: user._id,
        idActividad: user.activity[0]._id,
        motivo: type,
      });
    }
    if (type === "archivo") {
      console.log("entre aqui");

      darDeBajaRevision.mutate({
        id: user._id,
      });
    }
  };

  return (
    <div className="card" style={{ width: "100%", fontSize: "14px" }}>
      <img
        src={user.foto ? user.foto : avatar}
        className="card-img-top"
        style={{ width: "100%", height: "200px" }}
      />
      <div className="card-body">
        <div className="d-flex flex-column justify-content-center align-items-center gap-2">
          <b className="card-title">
            {user.nombre} {user.apellido}
          </b>
          <p>{user.customId}</p>
        </div>
        <p className="card-subtitle text-danger fw-bold mt-1">
          Actividad Inscripta
        </p>
        {user.activity.length > 0 ? (
          <>
            <b className="card-text">{user.activity[0].name}</b>
            <p className="card-text mt-2">
              {user.activity[0].hourStart} - {user.activity[0].hourFinish}
            </p>
            <p className="card-text">{user.activity[0].date.join(" - ")}</p>
          </>
        ) : (
          <div>
            <p>El usuario no se encuentra inscripto en ninguna actividad</p>
          </div>
        )}
      </div>
      <ul className="list-group list-group-flush">
        <LiElement archivo={user.fichaMedica} label={"Ficha Medica"} />
        <LiElement archivo={user.certificadoHongos} label={"PyM"} />
        <LiElement archivo={user.fotoDocumento} label={"Documento"} />
        {user.natacionAdaptada && user.cud && (
          <LiElement archivo={user.cud} label={"CUD"} />
        )}
        {user.natacionAdaptada && !user.cud && (
          <li className="list-group-item">CUD no cargado</li>
        )}
      </ul>

      {type === "certificado" || type === "archivo" ? (
        <>
          <p
            className={`${
              calcular_fecha(user.fechaCargaCertificadoHongos) > 0
                ? "text-success text-center my-1"
                : "text-success"
            }`}
          >
            {calcular_fecha(user.fechaCargaCertificadoHongos) > 0 ? (
              <span>
                Pasaron{" "}
                <b className="text-danger">
                  {Math.abs(calcular_fecha(user.fechaCargaCertificadoHongos))}{" "}
                </b>
                Dias de ulitma actualizacion
              </span>
            ) : (
              `Faltan ${Math.abs(
                calcular_fecha(user.fechaCargaCertificadoHongos)
              )} Dias`
            )}
          </p>
          {darDeBaja.isLoading ? (
            <div className="text-center py-1">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <form className="form-control" onClick={handleSubmit}>
              <button className="w-100 btn btn-danger">Dar de Baja</button>
            </form>
          )}
        </>
      ) : (
        <>
          <div className="card-body d-flex flex-column justify-content-between gap-2">
            <div className="d-flex flex-column justify-content-center align-items-center gap-2">
              <button
                className="btn btn-success w-100"
                onClick={() => {
                  toast.info("Habilitando usuario...");
                  aceptarUsuario.mutate({ id: user._id });
                }}
              >
                Aceptar
              </button>
              <button
                className="btn btn-danger w-100"
                onClick={() => {
                  toast.info("inhabilitando usuario");
                  denegarUsuario.mutate({
                    id: user._id,
                    activityId: user.activity[0]._id,
                  });
                }}
              >
                Denegar
              </button>
            </div>
            <div>
              <button
                className="btn btn-primary w-100"
                onClick={() => setSend(!send)}
              >
                {send ? "Cancelar" : "Enviar notificación"}
              </button>

              {send && (
                <form action="" onSubmit={handleSendNotification}>
                  <div className="mb-1 d-flex">
                    <label htmlFor="" className="form-label">
                      Asunto
                    </label>
                    <input
                      type="text"
                      name="asunto"
                      id=""
                      className="form-control"
                    />
                  </div>
                  <div className="mb-1 d-flex">
                    <label htmlFor="" className="form-label">
                      cuerpo
                    </label>
                    <textarea
                      type="text"
                      name="cuerpo"
                      id=""
                      className="form-control"
                    />
                  </div>
                  <button className="btn btn-warning">Enviar</button>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserCard;
