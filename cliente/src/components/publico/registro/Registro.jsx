import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

import Swal from "sweetalert2";
import style from "./styleFormulario.module.css";

import InsertarFoto from "./Foto";
import Logo from "../inicioDeSesion/Logo.jpg";
import InformacionUsuario from "./InformacionUsuario";
import InformacionTutor from "./InformacionTutor";
import EmailYPass from "./EmailYPass";
import Barrio from "./Barrio";

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
    barrio: "",
    ciudad: "",
    telefono: "",
    telefonoContacto: "",
    email: "",
    password: "",
    repetirPassword: "",
    foto: "",

    // informacion tutor
    nombreTutor: "",
    apellidoTutor: "",
    dniTutor: "",
    emailTutor: "",
    telefonoTutor: "",
  });

  const [error, setError] = useState({
    status: false,
    message: "",
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // console.log(usuario);
    setError({
      status: false,
      message: "",
    });
  }, [usuario]);

  useEffect(() => {}, [esMenor]);

  useEffect(() => {}, [cargaDeDatos]);

  const handleNatacionAdaptada = (e) => {
    setUsuario({
      ...usuario,
      natacionAdaptada: e.target.value,
    });
    setCargaDeDatos(cargaDeDatos + 1);
  };

  const handleEdad = (e) => {
    //que no pueda escribir mas de 2 numeros
    if (e.target.value.length > 2) {
      return null;
    }

    setUsuario({ ...usuario, edad: e.target.value });

    if (e.target.value < 18) {
      setEsMenor(true);
    } else {
      setEsMenor(false);
    }
  };

  const handleDni = (e) => {
    //que no pueda escribir mas de 8 numeros
    if (e.target.value.length > 8) {
      return null;
    }

    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleTelefono = (e) => {
    //que no pueda escribir mas de 8 numeros
    if (e.target.value.length > 15) {
      return null;
    }

    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setError({
      status: false,
      message: "",
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function esCorreoElectronico(email) {
      return emailRegex.test(email);
    }

    if (cargaDeDatos === 2 && usuario.edad === "") {
      setError({
        status: true,
        message: "Debes ingresar la edad del usuario",
      });
      return null;
    }

    if (
      cargaDeDatos === 3 &&
      (usuario.nombre === "" ||
        usuario.apellido === "" ||
        usuario.dni === "" ||
        usuario.sexo === "")
    ) {
      setError({
        status: true,
        message: "Debes completar todos los campos",
      });

      return null;
    }

    if (
      cargaDeDatos === 3 &&
      !esMenor &&
      usuario.natacionAdaptada === "no" &&
      (usuario.nombre === "" ||
        usuario.apellido === "" ||
        usuario.dni === "" ||
        usuario.sexo === "" ||
        usuario.telefono === "" ||
        usuario.telefonoContacto === "" ||
        usuario.email === "" ||
        usuario.ciudad === "")
    ) {
      setError({
        status: true,
        message: "Debes completar todos los campos",
      });

      return null;
    }

    if (
      (usuario.ciudad === "Santiago del Estero" ||
        usuario.ciudad === "La Banda") &&
      usuario.barrio === ""
    ) {
      setError({
        status: true,
        message: "Debes completar todos los campos",
      });
      return null;
    }

    if (
      cargaDeDatos === 3 &&
      !esMenor &&
      usuario.natacionAdaptada === "no" &&
      !esCorreoElectronico(usuario.email)
    ) {
      setError({
        status: true,
        message: "Debes ingresar un correo valido",
      });

      return null;
    }

    if (cargaDeDatos === 3 && !esMenor && usuario.natacionAdaptada === "no") {
      console.log("entre aqui");
      setCargaDeDatos(cargaDeDatos + 2);
      return null;
    }

    if (
      cargaDeDatos === 4 &&
      (usuario.nombreTutor === "" ||
        usuario.apellidoTutor === "" ||
        usuario.dniTutor === "" ||
        usuario.emailTutor === "" ||
        usuario.telefonoTutor === "" ||
        usuario.telefonoContacto === "")
    ) {
      setError({
        status: true,
        message: "Debes completar todos los campos",
      });
      return null;
    }

    //verificar que el email sea un correo valido con expresion regular

    if (cargaDeDatos === 4 && !esCorreoElectronico(usuario.emailTutor)) {
      setError({
        status: true,
        message: "Debes ingresar un correo valido",
      });
      return null;
    } else if (cargaDeDatos === 6) {
      return null;
    } else if (cargaDeDatos === 5 && usuario.foto === "") {
      return null;
    } else {
      setCargaDeDatos(cargaDeDatos + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //verifico que todos los datos de email y contraseña esten completos

    if (usuario.foto === "") {
      setError({
        status: true,
        message: "Debes subir una foto de perfil",
      });
      return null;
    }

    if (usuario.password === "" || usuario.repetirPassword === "") {
      setError({
        status: true,
        message: "Debes completar todos los campos",
      });
      return null;
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

    //si el usuario no es menor y no es de natacion adaptada, borro las propiedades de tutor de mi  objeto

    if (!esMenor && !usuario.natacionAdaptada) {
      console.log("entre aqui");
      delete data.nombreTutor;
      delete data.apellidoTutor;
      delete data.dniTutor;
      delete data.emailTutor;
      delete data.telefonoTutor;
    }

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
          className="progress"
          role="progressbar"
          aria-label="Warning example"
          aria-valuenow="75"
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: "100%" }}
        >
          <div
            className="progress-bar text-bg-warning"
            style={{ width: `${cargaDeDatos * 25 - 25}%` }}
          ></div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={style.formSection}>
            {/* informacion usuario */}

            {cargaDeDatos === 1 && (
              <div className={style.section1}>
                <h3>¿Usuario de Natacion Adaptada?</h3>
                <div className={style.formGroup}>
                  <button value="si" onClick={handleNatacionAdaptada}>
                    Si
                  </button>
                  <button value="no" onClick={handleNatacionAdaptada}>
                    No
                  </button>
                </div>
              </div>
            )}
            {cargaDeDatos === 2 && (
              <div className={style.section1}>
                <h3>Edad del Usuario</h3>
                <div className={style.formGroup}>
                  <input
                    type="number"
                    value={usuario.edad}
                    onChange={handleEdad}
                  />
                </div>
              </div>
            )}

            {/* inofrmacion de tutor */}
            {cargaDeDatos === 3 && (
              <>
                <InformacionUsuario
                  setUsuario={setUsuario}
                  usuario={usuario}
                  esMenor={esMenor}
                  handleDni={handleDni}
                  handleTelefono={handleTelefono}
                />
                <Barrio setUsuario={setUsuario} usuario={usuario} />
              </>
            )}

            {/* informacion ubicacion y telefono */}

            {cargaDeDatos === 4 && (
              <InformacionTutor
                setUsuario={setUsuario}
                usuario={usuario}
                handleDni={handleDni}
                handleTelefono={handleTelefono}
              />
            )}

            {/* Imagen de perfil */}

            {cargaDeDatos === 5 && (
              <>
                <InsertarFoto
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  setUsuario={setUsuario}
                  usuario={usuario}
                  success={success}
                  setSuccess={setSuccess}
                />

                <EmailYPass
                  registro={registro}
                  setUsuario={setUsuario}
                  usuario={usuario}
                />
              </>
            )}

            {/* creacion de cuenta */}
          </div>

          {/* <br /> */}
          {
            <div className={style.error}>
              {error.status ? <p>{error.message}</p> : null}
            </div>
          }
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
                  setError({
                    status: false,
                    message: "",
                  });
                  if (
                    cargaDeDatos === 5 &&
                    !esMenor &&
                    usuario.natacionAdaptada === "no"
                  ) {
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
                  fillRule="evenodd"
                  d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
                />
              </svg>
            ) : null}
            {cargaDeDatos < 5 && cargaDeDatos > 1 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-arrow-right-circle"
                viewBox="0 0 16 16"
                onClick={handleNext}
                style={{
                  cursor:
                    cargaDeDatos === 5 && usuario.foto === ""
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <path
                  fillRule="evenodd"
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
