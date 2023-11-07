import React, { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { baseUrl } from "../../../../helpers/url";
import Swal from "sweetalert2";

import style from "./style.module.css";

const editarPerfilFetch = async (data) => {
  const response = await fetch(baseUrl + "user/editarUsuario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();

  return res;
};

function EditarPerfil({ usuario }) {
  // Crear un estado local para rastrear los cambios
  const [formValues, setFormValues] = useState(usuario);

  const queryClient = useQueryClient();

  const editarPerfil = useMutation({
    mutationFn: editarPerfilFetch,
    onSuccess: (data) => {
      Swal.fire({
        title: data.status.toUpperCase(),
        text: data.message,
        icon: data.status,
        confirmButtonText: "Aceptar",
      });

      queryClient.invalidateQueries("getUser");
    },
    onError: (error) => {
      Swal.fire({
        title: error.status.toUpperCase(),
        text: error.message,
        icon: error.status,
        confirmButtonText: "Aceptar",
      });
    },
  });

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Enviar la solicitud al backend
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar 'formValues' al backend usando una función o biblioteca para hacer peticiones HTTP.
    editarPerfil.mutate(formValues);
  };

  const verificarKey = (key) => {
    if (
      key !== "activity" &&
      key !== "customId" &&
      key !== "status" &&
      key !== "role" &&
      key !== "password" &&
      key !== "email" &&
      key !== "id" &&
      key !== "createdAt" &&
      key !== "updatedAt" &&
      key !== "_id" &&
      key !== "asistencia" &&
      key !== "__v" &&
      key !== "dni" &&
      key !== "foto" &&
      key !== "emailVerified" &&
      key !== "emailVerificationToken" &&
      key !== "cud" &&
      key !== "certificadoHongos" &&
      key !== "fechaCargaCertificadoHongos" &&
      key !== "fichaMedica"
    ) {
      return true;
    }
  };

  const [edicionActiva, setEdicionActiva] = useState(false);

  return (
    <div>
      <div className={style.info}>
        <label htmlFor="">Numero De Usuario</label>
        <p>{usuario.customId}</p>
      </div>

      <div>
        {!usuario.status && usuario.activity?.length > 0 ? (
          <div className={style.info}>
            <label htmlFor="">Actividad:</label>
            <p>Esperando confirmacion</p>
          </div>
        ) : null}
        {usuario.status && usuario.activity?.length > 0 ? (
          <>
            <div className={style.body__activity}>
              <div className={style.info}>
                <label htmlFor="">Actividad:</label>

                <p>{usuario.activity[0].name}</p>
                {/* icono de X para dar de baja */}
              </div>
              <div className={style.info}>
                <label htmlFor="">Dias:</label>
                <p>{usuario.activity[0].date.join(" - ")}</p>
              </div>
              <div className={style.info}>
                <label htmlFor="">Horario:</label>
                <p>
                  {usuario.activity[0].hourStart} -{" "}
                  {usuario.activity[0].hourFinish}
                </p>
              </div>
              <button>Dar de baja</button>
            </div>
          </>
        ) : null}
        {usuario.status && usuario.activity?.length === 0 ? (
          <div className={style.info}>
            <label htmlFor="">Actividad:</label>
            <p>No tienes actividad</p>
          </div>
        ) : null}
      </div>

      <form action="">
        {Object.keys(usuario).map((key) => {
          if (verificarKey(key)) {
            return (
              <div className={style.info}>
                {usuario[key] == null ? null : (
                  <>
                    <label htmlFor="">
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </label>
                    {edicionActiva ? (
                      <input
                        type="text"
                        value={usuario[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                      />
                    ) : (
                      <p>{usuario[key] ? usuario[key] : "No"}</p>
                    )}
                  </>
                )}
              </div>
            );
          }
        })}

        {!edicionActiva ? (
          <button
            className={style.button__editar}
            onClick={() => setEdicionActiva(!edicionActiva)}
          >
            Editar Informacion
            <i class="bi bi-pencil"></i>
          </button>
        ) : (
          <div className={style.buttons}>
            <button
              className={style.button__cancel}
              onClick={() => setEdicionActiva(!edicionActiva)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
            <button
              className={style.button__confirm}
              onClick={(e) => handleSubmit(e)}
            >
              <i className="bi bi-check-lg"></i>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default EditarPerfil;
