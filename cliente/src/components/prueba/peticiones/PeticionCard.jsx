import { useMutation, useQueryClient } from "react-query";
import style from "./peticiones.module.css";
import { peticiones } from "../../../helpers/Peticiones/peticiones.helpers";
import { toast, Toaster } from "sonner";
import UserImages from "../users/utilidades/UserImages";
import { useState } from "react";

function PeticionCard({ peticion }) {
  const [imagen, setImagen] = useState(peticion.user.certificadoHongos);
  const [view, setView] = useState(false);
  const colorBorde = {
    pendiente: "grey",
    aceptado: "green",
    denegado: "red",
  };

  const queryClient = useQueryClient();

  const aceptar = useMutation({
    mutationFn: peticiones.aceptarPeticion,
    onSuccess: (data) => {
      toast.info(data.msg);
      queryClient.invalidateQueries("peticiones");
    },
  });
  const denegar = useMutation({
    mutationFn: peticiones.denegarPeticion,
    onSuccess: (data) => {
      toast.info(data.msg);
      queryClient.invalidateQueries("peticiones");
    },
  });

  const handleAceptar = () => {
    toast.info("Aceptando solicitud...");
    aceptar.mutate({ id: peticion._id });
  };
  const handleDenegar = () => {
    toast.info("Denegando solicitud...");
    denegar.mutate({ id: peticion._id });
  };

  return (
    <div
      className={style.card__body}
      style={{ border: `3px solid ${colorBorde[peticion.estado]}` }}
    >
      <div className={style.card__user}>
        <h5>
          {peticion.user.nombre} {peticion.user.apellido}
        </h5>
        <b>{peticion.user.customId}</b>
        <div>
          <p>
            Certificado PyM:{" "}
            {peticion.user.certificadoHongos ? (
              <span
                onClick={() => {
                  setView(true);
                  setImagen(peticion.user.certificadoHongos);
                }}
                style={{
                  color: "blue",
                  cursor: "pointer",
                }}
              >
                Abrir
              </span>
            ) : (
              "Falta Cargar"
            )}
          </p>
          <p>Fecha de Carga: {peticion.user.fechaCargaCertificadoHongos}</p>
        </div>
      </div>
      {view ? (
        // <UserImages imagen={imagen} setView={setView} setImagen={setImagen} />
        <div className={style.img__container}>
          <button
            onClick={() => {
              setView(false);
            }}
            className={`btn btn-lg btn-danger ${style.btn__close}`}
          >
            X
          </button>
          <img src={imagen} alt="" className={style.img} />
        </div>
      ) : (
        <>
          <section>
            <div>
              Tipo de solicitud: <b>{peticion.asunto}</b>
            </div>
            {peticion.asunto !== "baja" && (
              <div>
                <b>Actividad a inscribir :</b>
                {peticion.activity.name} | {peticion.activity.date.join(" - ")}{" "}
                {peticion.activity.hourStart} - {peticion.activity.hourFinish}
              </div>
            )}
            {peticion.asunto == "cambiar" && (
              <div>
                <b>Actividad actual:</b>
                {peticion.activityBaja.name} |{" "}
                {peticion.activityBaja.date.join(" - ")}{" "}
                {peticion.activityBaja.hourStart} -{" "}
                {peticion.activityBaja.hourFinish}
              </div>
            )}
            {peticion.asunto == "baja" && (
              <div>
                <b>Actividad a dar de baja:</b>
                <p>
                  {" "}
                  {peticion.activity.name} |{" "}
                  {peticion.activity.date.join(" - ")}{" "}
                  {peticion.activity.hourStart} - {peticion.activity.hourFinish}
                </p>
              </div>
            )}
            {peticion.motivo && (
              <div>
                Motivo:
                <b>{peticion.motivo}</b>
              </div>
            )}
            {peticion.pedido && (
              <div>
                Pedido:
                <b>
                  {peticion.pedido.nombre} {peticion.pedido.apellido}
                </b>
              </div>
            )}
          </section>

          {peticion.estado === "pendiente" && (
            <div className={style.buttons__body}>
              <button
                className="btn btn-sm btn-success"
                onClick={handleAceptar}
              >
                Aceptar
              </button>
              <button className="btn btn-sm btn-danger" onClick={handleDenegar}>
                Denegar
              </button>
            </div>
          )}
        </>
      )}
      <Toaster position="bottom-center" />
    </div>
  );
}

export default PeticionCard;
