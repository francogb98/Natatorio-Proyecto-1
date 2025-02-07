import { useMutation, useQueryClient } from "react-query";
import avatar from "../../../../../assets/avatar.webp";
import LiElement from "./LiElement";
import { UserFetchPrivado } from "../../../../../helpers/UserFetchConClases/FETCH-privado/UserFetch-Privado";
import { HabilitarUsuario } from "../../../../../helpers/usersFetch/HabilitarUsuario";

import { toast } from "sonner";
import Swal from "sweetalert2";
import { useState } from "react";

function UserCard({ user }) {
  const [send, setSend] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.asunto || !formData.cuerpo) {
      toast.error("Completa todos los campos");
      return;
    }
    console.log(formData);

    toast.info("Enviando notificación...");

    const content = {
      id: user._id,
      asunto: formData.asunto,
      cuerpo: formData.cuerpo,
    };
    enviarNotificacion.mutate(content);
  };

  return (
    <div className="card" style={{ width: "100%", fontSize: "14px" }}>
      <img
        src={user.foto ? user.foto : avatar}
        className="card-img-top"
        style={{ width: "100%", height: "200px" }}
      />
      <div className="card-body">
        <b className="card-title">
          {user.nombre} {user.apellido}
        </b>
        <p className="card-subtitle text-danger fw-bold mt-1">
          Actividad Inscripta
        </p>
        <b className="card-text">{user.activity[0].name}</b>
        <p className="card-text mt-2">
          {user.activity[0].hourStart} - {user.activity[0].hourFinish}
        </p>
        <p className="card-text">{user.activity[0].date.join(" - ")}</p>
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
      <div className="card-body d-flex flex-column justify-content-between gap-2">
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-sm btn-success"
            onClick={() => {
              toast.info("Habilitando usuario...");
              aceptarUsuario.mutate({ id: user._id });
            }}
          >
            Aceptar
          </button>
          <button
            className="btn btn-sm btn-danger"
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
            className="btn btn-sm btn-primary w-100"
            onClick={() => setSend(!send)}
          >
            {send ? "Cancelar" : "Enviar notificación"}
          </button>

          {send && (
            <form
              action=""
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);

                if (
                  !formData.get("asunto").trim() ||
                  !formData.get("cuerpo").trim()
                ) {
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
              }}
            >
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
    </div>
  );
}

export default UserCard;
