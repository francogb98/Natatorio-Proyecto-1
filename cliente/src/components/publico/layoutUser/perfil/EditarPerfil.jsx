import React, { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { baseUrl } from "../../../../helpers/url";

import Swal from "sweetalert2";
import { AuthContext } from "../../../../context/AuthContext";

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

  return (
    <form onSubmit={handleSubmit}>
      <div className={style.body_editarPerfil}>
        {Object.keys(formValues).map((clave) => {
          if (
            clave === "_id" ||
            clave === "customId" ||
            clave === "role" ||
            clave === "email" ||
            clave === "emailVerificationToken" ||
            clave === "emailVerified" ||
            clave === "__v" ||
            clave === "password" ||
            clave === "foto" ||
            clave === "activity" ||
            clave === "cud" ||
            clave === "asistencia" ||
            clave == "certificadoHongos" ||
            clave == "fichaMedica" ||
            clave == "fechaCargaCertificadoHongos"
          ) {
            return null;
          }

          const valor = formValues[clave];

          if (valor == null) {
            return null;
          }

          return (
            <div key={clave}>
              <label htmlFor={clave} className="form-label">
                {clave.charAt(0).toUpperCase() + clave.slice(1)}
              </label>
              {clave === "sexo" ? (
                <select
                  className="form-select"
                  name={clave}
                  id={clave}
                  onChange={handleInputChange}
                  value={valor}
                >
                  <option value="null">--Sexo--</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              ) : clave === "natacionAdaptada" ? (
                <select
                  className="form-select"
                  name={clave}
                  id={clave}
                  onChange={handleInputChange}
                  value={valor ? "Si" : "No"}
                >
                  <option value="null">--Seleccionar opción--</option>
                  <option value="Si">Si</option>
                  <option value="No">No</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={valor}
                  name={clave}
                  className="form-control"
                  onChange={handleInputChange}
                />
              )}
            </div>
          );
        })}
        <div>
          <button
            type="submit"
            className="btn btn-dark mt-3"
            style={{ height: "fit-content" }}
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </form>
  );
}

export default EditarPerfil;
