import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

import Swal from "sweetalert2";
import style from "./styleFormulario.module.css";

import Barrio from "./Barrio";
import InsertarFoto from "./Foto";
import Logo from "../inicioDeSesion/Logo.jpg";

function Registro() {
  const { registro } = useContext(AuthContext);

  const [imageUrl, setImageUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));

    for (const [key, value] of Object.entries(data)) {
      if (
        key !== "nombreTutor" &&
        key !== "apellidoTutor" &&
        key !== "dniTutor" &&
        imageUrl === null
      ) {
        if (value === "") {
          return Swal.fire({
            title: "Error",
            text: "Todos los campos son obligatorios",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        }
      }
    }
    //verifico que las password sean iguales
    if (data.password !== data["repetir password"]) {
      return Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }

    data.nombreTutor = data.nombreTutor ? data.nombreTutor : null;
    data.apellidoTutor = data.apellidoTutor ? data.apellidoTutor : null;
    data.dniTutor = data.dniTutor ? data.dniTutor : null;
    data.barrio = data.barrio ? data.ciudad + "-" + data.barrio : data.ciudad;
    data.nombre = data.nombre + " " + data.apellido;
    data.foto = imageUrl;
    registro.mutate({ endpoint: "create", data, method: "POST" });
  };

  return (
    <div className={style.container}>
      <div className={style.icon}>
        <Link to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="45"
            height="45"
            fill="currentColor"
            class="bi bi-arrow-left-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
          </svg>
        </Link>
      </div>
      <div className={style.formContainer}>
        <img src={Logo} alt="" style={{ width: "160px" }} />
        <h1>Formulario de registro</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="mb-2">
              <label htmlFor="Nombre">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                placeholder="Enter Nombre"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="Nombre">Apellido</label>
              <input
                type="text"
                name="apellido"
                className="form-control"
                placeholder="Enter Apellido"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="Telefono">Telefono</label>
              <input
                type="text"
                name="telefono"
                className="form-control"
                placeholder="Enter Telefono"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="TelefonoContacto">TelefonoContacto</label>
              <input
                type="text"
                name="telefonoContacto"
                className="form-control"
                placeholder="Enter TelefonoContacto"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="Edad">Edad</label>
              <input
                type="text"
                name="edad"
                className="form-control"
                placeholder="Enter Edad"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="Email">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter Email"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="Password">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter Password"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="Repetir Password">Repetir Password</label>
              <input
                type="password"
                name="repetir password"
                className="form-control"
                placeholder="Enter Password"
              />
            </div>

            <div>
              <h3 htmlFor="imagen">Imagen de perfil</h3>
              <InsertarFoto imageUrl={imageUrl} setImageUrl={setImageUrl} />
            </div>
            <div className="mb-2">
              <label htmlFor="Dni">Dni</label>
              <input
                type="text"
                name="dni"
                className="form-control"
                placeholder="Enter Dni"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="dni" className={`form-label  mt-2`}>
                Sexo
              </label>
              <select className="form-select" name="sexo" id="sexo">
                <option value="null">--Sexo--</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <Barrio />
          </div>
          {/* inofrmacion de tutor */}
          <div
            style={{
              background: "rgb(250,0,0,0.3)",
              paddingInline: "15px",
              paddingBottom: "4px",
              borderRadius: "5px",
            }}
          >
            <h2 style={{ width: "fit-content" }} className="mx-auto mt-3">
              Infromacion de tutor
            </h2>
            <h5 style={{ color: "blue" }}>
              Completar solo en caso de que el nadador sea menor de edad
            </h5>
            <label htmlFor="nombreTutor" className={`form-label  mt-2`}>
              Nombre Del Tutor
            </label>
            <input
              type="text"
              name="nombreTutor"
              className="form-control"
              id="nombreTutor"
            />
            <label htmlFor="nombreTutor" className={`form-label  mt-2`}>
              Apellido Del Tutor
            </label>
            <input
              type="text"
              name="apellidoTutor"
              className="form-control"
              id="apellidoTutor"
            />

            <label htmlFor="dniTutor" className={`form-label  mt-2 `}>
              Dni Del Tutor
            </label>
            <input
              type="text"
              name="dniTutor"
              className="form-control"
              id="dniTutor"
            />
          </div>

          <br />
          {registro.isLoading && !registro.isSuccess && (
            <div className="alert alert-info">Cargando datos...</div>
          )}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className={style.buttonRegister}>Registrate</button>
          </div>
        </form>
        <div className="mt-3">
          <p>
            ¿Ya tienes cuenta? <Link to="/">Inicia Sesion</Link>
          </p>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}

export default Registro;
