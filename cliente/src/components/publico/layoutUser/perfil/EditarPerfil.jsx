import { useContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";

import style from "./style.module.css";

import Actividades from "./Actividades";
import { editarPerfilFetch } from "../../../../helpers/usersFetch/editarPerfli";
import InformacionPersonal from "./InformacionPersonal";

import { AuthContext } from "../../../../context/AuthContext";

function EditarPerfil() {
  // Crear un estado local para rastrear los cambios
  const { auth, userRefetch } = useContext(AuthContext);

  const [formValues, setFormValues] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    ciudad: "",
    barrio: "",
    edad: "",
    dni: "",
    natacionAdaptada: "",
  });

  const [edicionActiva, setEdicionActiva] = useState(false);

  const [menorEdadAlert, setMenorEdadAlert] = useState(false);

  const editarPerfil = useMutation({
    mutationFn: editarPerfilFetch,
    onSuccess: async (data) => {
      Swal.fire({
        title: "Usuario Editado",
        text: data.message,
        icon: data.status,
        confirmButtonText: "Aceptar",
      });

      // queryClient.invalidateQueries("getUser");
      userRefetch();
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
    setFormValues(auth.user);
  }, [auth.user]);
  useEffect(() => {
    console.log(formValues);
  }, [formValues]);
  // Enviar la solicitud al backend
  const handleSubmitAdulto = (e) => {
    e.preventDefault();
    // Aquí puedes enviar 'formValues' al backend usando una función o biblioteca para hacer peticiones HTTP.
    editarPerfil.mutate(formValues);
  };

  return (
    <div
      style={{
        paddingInline: "40px",
        background: "aliceblue",
        paddingBlock: "20px",
      }}
    >
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={"/user/perfil"}>Perfil</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            <strong>Informacion-Perfil</strong>
          </li>
        </ol>
      </nav>

      <div className={style.info}>
        <label htmlFor="">Numero De usuario</label>
        <h3>{auth.user.customId}</h3>
      </div>

      <div className="text-center">
        <img
          src={auth.user?.foto}
          alt=""
          className="rounded mx-auto d-block"
          style={{
            width: "200px",
            height: "200px",
          }}
        />
      </div>

      <Actividades user={auth.user} refetch={userRefetch} />

      <h1 className="text-center fw-bold">Informacion Personal</h1>

      <hr />
      {/* {auth.user.status && (
        <div
          className="d-flex fs-3 fw-bold"
          style={{
            justifyContent: "space-between",
          }}
        >
          <p>Inasitencias: </p>
          <p className="text-danger fw-bold">
            {auth.user.inasistencias.length}
          </p>
        </div>
      )} */}
      <div
        className="d-flex fs-3"
        style={{
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontSize: "15px",
            fontWeight: "bold",
          }}
        >
          Fecha de carga certificado Pediculos y Micosis:{" "}
        </p>
        <p className="text-danger fw-bold">
          {auth.user.fechaCargaCertificadoHongos}
        </p>
      </div>

      <hr />
      <InformacionPersonal
        formValues={formValues}
        handleInputChange={handleInputChange}
        edicionActiva={edicionActiva}
        handleSubmitAdulto={handleSubmitAdulto}
        setMenorEdadAlert={setMenorEdadAlert}
        setEdicionActiva={setEdicionActiva}
        menorEdadAlert={menorEdadAlert}
        setFormValues={setFormValues}
      />
    </div>
  );
}

export default EditarPerfil;
