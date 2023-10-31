import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

import Swal from "sweetalert2";
import style from "./styleFormulario.module.css";

import Barrio from "./Barrio";
import InsertarFoto from "./Foto";
import Logo from "../inicioDeSesion/Logo.jpg";
import InformacionUsuario from "./InformacionUsuario";
import InformacionTutor from "./InformacionTutor";
import UbicacionYContacto from "./UbicacionYContacto";
import EmailYPass from "./EmailYPass";
import InformacionUsuario2 from "./InformacionUsuario2";

function Registro() {
  const { registro } = useContext(AuthContext);

  const [imageUrl, setImageUrl] = useState(null);

  const [cargaDeDatos, setCargaDeDatos] = useState(1);
  const [esMenor, setEsMenor] = useState(false);

  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    sexo: "",
    edad: "",
    natacionAdaptada: "",
    nombreTutor: "",
    apellidoTutor: "",
    dniTutor: "",
    barrio: "",
    ciudad: "",
    telefono: "",
    telefonoContacto: "",
    email: "",
    password: "",
    repetirPassword: "",
    foto: "",
  });

  useEffect(() => {}, [usuario]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //verifico que todos los datos de usuario esten completos

    if (
      usuario.nombre === "" ||
      usuario.apellido === "" ||
      usuario.dni === "" ||
      usuario.sexo === "" ||
      usuario.edad === "" ||
      usuario.natacionAdaptada === ""
    ) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes completar todos los campos de informacion de usuario",
      });
    }

    //verifico que todos los datos de tutor esten completos

    if (esMenor) {
      if (
        usuario.nombreTutor === "" ||
        usuario.apellidoTutor === "" ||
        usuario.dniTutor === ""
      ) {
        return Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Debes completar todos los campos de informacion de tutor",
        });
      }
    }

    //verifico que todos los datos de ubicacion y contacto esten completos

    if (usuario.ciudad === "" || usuario.telefono === "") {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes completar todos los campos de ubicacion y contacto",
      });
    }

    //verifico que todos los datos de email y contraseña esten completos

    if (
      usuario.email === "" ||
      usuario.password === "" ||
      usuario.repetirPassword === ""
    ) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes completar todos los campos de email y contraseña",
      });
    }

    //verifico que las contraseñas coincidan

    if (usuario.password !== usuario.repetirPassword) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Las contraseñas no coinciden",
      });
    }

    let data = usuario;

    data.nombreTutor = usuario.nombreTutor ? usuario.nombreTutor : null;
    data.apellidoTutor = usuario.apellidoTutor ? usuario.apellidoTutor : null;
    data.dniTutor = usuario.dniTutor ? usuario.dniTutor : null;
    data.ciudad = usuario.ciudad;
    data.barrio = usuario.barrio ? usuario.barrio : null;
    data.nombre = usuario.nombre;
    data.apellido = usuario.apellido;
    data.natacionAdaptada = usuario.natacionAdaptada === "si" ? true : false;
    data.foto = usuario.foto;

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
            className="bi bi-arrow-left-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
          </svg>
        </Link>
      </div>
      <div className={style.formContainer}>
        <img src={Logo} alt="" style={{ width: "160px" }} />
        <h1>Formulario de registro</h1>
        <div
          class="progress"
          role="progressbar"
          aria-label="Warning example"
          aria-valuenow="75"
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: "100%" }}
        >
          <div
            class="progress-bar text-bg-warning"
            style={{ width: `${cargaDeDatos * 20 - 20}%` }}
          ></div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={style.formSection}>
            {/* informacion usuario */}

            {cargaDeDatos === 1 && (
              <InformacionUsuario setUsuario={setUsuario} usuario={usuario} />
            )}
            {cargaDeDatos === 2 && (
              <InformacionUsuario2
                setEsMenor={setEsMenor}
                setUsuario={setUsuario}
                usuario={usuario}
              />
            )}

            {/* inofrmacion de tutor */}
            {cargaDeDatos === 3 && esMenor && (
              <InformacionTutor setUsuario={setUsuario} usuario={usuario} />
            )}

            {/* informacion ubicacion y telefono */}

            {cargaDeDatos === 4 && (
              <UbicacionYContacto setUsuario={setUsuario} usuario={usuario} />
            )}

            {/* Imagen de perfil */}

            {cargaDeDatos === 5 && (
              <InsertarFoto
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                setUsuario={setUsuario}
                usuario={usuario}
              />
            )}

            {/* creacion de cuenta */}

            {cargaDeDatos === 6 && (
              <EmailYPass
                registro={registro}
                setUsuario={setUsuario}
                usuario={usuario}
              />
            )}
          </div>

          <br />
          <div
            style={{
              display: "flex",
              justifyContent: cargaDeDatos === 1 ? "flex-end" : "space-between",
              marginTop: "20px",
            }}
          >
            {cargaDeDatos > 1 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-arrow-left-circle"
                viewBox="0 0 16 16"
                onClick={() => {
                  if (cargaDeDatos === 4 && !esMenor) {
                    setCargaDeDatos(cargaDeDatos - 2);
                  } else if (cargaDeDatos === 0) {
                    return null;
                  } else {
                    setCargaDeDatos(cargaDeDatos - 1);
                  }
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                <path
                  fill-rule="evenodd"
                  d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
                />
              </svg>
            ) : null}
            {cargaDeDatos < 6 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-arrow-right-circle"
                viewBox="0 0 16 16"
                onClick={() => {
                  if (cargaDeDatos === 2 && !esMenor) {
                    setCargaDeDatos(cargaDeDatos + 2);
                  } else if (cargaDeDatos === 6) {
                    return null;
                  } else if (cargaDeDatos === 5 && usuario.foto === "") {
                    return null;
                  } else {
                    setCargaDeDatos(cargaDeDatos + 1);
                  }
                }}
                style={{
                  cursor:
                    cargaDeDatos === 5 && usuario.foto === ""
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <path
                  fill-rule="evenodd"
                  d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                />
              </svg>
            ) : null}
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
