import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import Swal from "sweetalert2";

import style from "./style.module.css";

import Actividades from "./Actividades";
import { editarPerfilFetch } from "../../../../helpers/usersFetch/editarPerfli";
import Foto from "./Foto";
import ProfileImageUpload from "./Prueba";

function EditarPerfil({ usuario }) {
  // Crear un estado local para rastrear los cambios
  const [formValues, setFormValues] = useState(usuario);

  const [edicionActiva, setEdicionActiva] = useState(false);

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
      setEdicionActiva(!edicionActiva);
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

  useEffect(() => {
    setFormValues(usuario);
  }, [usuario]);

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
      key !== "foto" &&
      key !== "emailVerified" &&
      key !== "emailVerificationToken" &&
      key !== "cud" &&
      key !== "certificadoHongos" &&
      key !== "fechaCargaCertificadoHongos" &&
      key !== "fichaMedica" &&
      key !== "notificaciones" &&
      key !== "public_id_foto"
    ) {
      return true;
    }
  };

  return (
    <div>
      <div className={style.info}>
        <label htmlFor="">Numero De Usuario</label>
        <p>{usuario.customId}</p>
      </div>

      <Actividades usuario={usuario} />

      <Foto usuario={usuario} />

      <form action="" className={style.form}>
        {Object.keys(usuario).map((key, i) => {
          if (verificarKey(key)) {
            return (
              <div className={style.info} key={i}>
                {usuario[key] == null ? null : (
                  <>
                    <label htmlFor="">
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </label>
                    {edicionActiva ? (
                      <input
                        type="text"
                        name={key}
                        value={formValues[key]}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className={style.text}>
                        <p>{usuario[key] ? usuario[key] : "No"}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          }
        })}

        {
          editarPerfil.isLoading ? (
            //spinner
            <div style={{ width: "100%", textAlign: "center" }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : null // Si la solicitud está en progreso, deshabilita el botón de enviar
        }

        {!edicionActiva ? (
          <button
            className={style.button__editar}
            onClick={() => setEdicionActiva(!edicionActiva)}
          >
            Editar Informacion
            <i className="bi bi-pencil"></i>
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
