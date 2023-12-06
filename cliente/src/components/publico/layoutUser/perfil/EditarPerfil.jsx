import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";

import style from "./style.module.css";

import Actividades from "./Actividades";
import { editarPerfilFetch } from "../../../../helpers/usersFetch/editarPerfli";
import Foto from "./Foto";
import InformacionPersonal from "./InformacionPersonal";
import InformacionContacto from "./InformacionContacto";

function EditarPerfil({ usuario }) {
  // Crear un estado local para rastrear los cambios
  const [formValues, setFormValues] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    ciudad: "",
    barrio: "",
    edad: "",
    dni: "",

    // Informacion Contacto
    nombreTutor: "",
    apellidoTutor: "",
    emailTutor: "",
    telefonoTutor: "",
    dniTutor: "",
  });

  const [edicionActiva, setEdicionActiva] = useState(false);
  const [edicionActivaTutor, setEdicionActivaTutor] = useState(false);

  const [menorEdadAlert, setMenorEdadAlert] = useState(false);

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
  useEffect(() => {
    console.log(menorEdadAlert);
  }, [menorEdadAlert]);

  // Enviar la solicitud al backend
  const handleSubmitAdulto = (e) => {
    e.preventDefault();

    if (formValues.edad < 18) {
      setMenorEdadAlert(true);
      return;
    }

    console.log(formValues);
    // Aquí puedes enviar 'formValues' al backend usando una función o biblioteca para hacer peticiones HTTP.
    editarPerfil.mutate(formValues);
  };

  const handleSubmitMenor = (e) => {
    e.preventDefault();

    console.log(formValues);

    editarPerfil.mutate(formValues);

    setMenorEdadAlert(false);
  };

  return (
    <div
      style={{
        paddingInline: "40px",
      }}
    >
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={"perfil"}>Perfil</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            <strong>Informacion-Perfil</strong>
          </li>
        </ol>
      </nav>

      <div className={style.info}>
        <label htmlFor="">Numero De Usuario</label>
        <h3>{usuario.customId}</h3>
      </div>

      <Foto usuario={usuario} />

      <Actividades usuario={usuario} />

      <h2>Informacion Personal</h2>

      {menorEdadAlert ? (
        <div className="alert alert-danger mt-2" role="alert">
          Deberas completar la Informacion de Tutor, desliza hacia abajo.
        </div>
      ) : null}
      <InformacionPersonal
        formValues={formValues}
        handleInputChange={handleInputChange}
        edicionActiva={edicionActiva}
        handleSubmitAdulto={handleSubmitAdulto}
        setMenorEdadAlert={setMenorEdadAlert}
        setEdicionActiva={setEdicionActiva}
        menorEdadAlert={menorEdadAlert}
      />
    </div>
  );
}

export default EditarPerfil;
