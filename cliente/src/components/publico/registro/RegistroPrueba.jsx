import React, { useEffect, useState } from "react";

import style from "./styleFormulario.module.css";
import { Link } from "react-router-dom";

import Logo from "../inicioDeSesion/Logo.jpg";
import Barrio from "./Barrio";

import useRegister from "./hookFetch/useRegister";

function RegistroPrueba() {
  const {
    usuario,
    setUsuario,
    handleChange,
    handleSubmit,
    errores,
    registro,
    isNatacionAdaptada,
    setIsNatacionAdaptada,
    isDisabled,
  } = useRegister();

  const [viewPass, setViewPass] = useState(false);
  const [viewPass2, setViewPass2] = useState(false);

  //   useEffect(() => {}, [isNatacionAdaptada]);

  return (
    <section className={style.container}>
      <header className={style.icon}>
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
      </header>

      <main className={style.formContainer}>
        <img src={Logo} alt="" style={{ width: "160px" }} />
        <h1>Formulario de registro</h1>

        <form action="">
          <div className="mt-3">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={usuario.nombre}
              className="form-control"
              placeholder="ej: Juan"
              style={{
                marginTop: "-10px",
              }}
              onChange={handleChange}
            />
          </div>
          <div className="mt-3">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={usuario.apellido}
              className="form-control"
              placeholder="ej: Perez"
              style={{
                marginTop: "-10px",
              }}
              onChange={handleChange}
            />
          </div>
          <div className="mt-3">
            <label htmlFor="edad">Edad</label>
            <input
              type="number"
              name="edad"
              value={usuario.edad}
              className="form-control"
              style={{
                marginTop: "-10px",
              }}
              onChange={handleChange}
            />
          </div>

          {/* DNI */}
          <>
            <div className="mt-3">
              <label htmlFor="dni">DNI</label>
              <input
                type="number"
                name="dni"
                value={usuario.dni}
                className="form-control"
                placeholder="ej: 40898658"
                style={{
                  marginTop: "-10px",
                }}
                onChange={handleChange}
              />
              <div id="dni" className="form-text">
                El DNI sera tu usuario para iniciar sesion.
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor="dni">Repetir DNI</label>
              <input
                type="number"
                name="dniRepetir"
                value={usuario.dniRepetir}
                className="form-control"
                placeholder="ej: 40898658"
                style={{
                  marginTop: "-10px",
                }}
                onChange={handleChange}
              />
              {errores.dniRepetir ? (
                <div className="text-danger text-center fw-bold">
                  {errores.dniRepetir}
                </div>
              ) : null}
            </div>
          </>

          {/* SEXO */}
          <div className="mt-3">
            <label htmlFor="dni" className={`form-label  mt-2`}>
              Sexo
            </label>

            <select
              className="form-select"
              name="sexo"
              id="sexo"
              onChange={handleChange}
            >
              <option value="null">--Sexo--</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          {/* Natacion Adaptada */}

          <>
            <div className="mt-3">
              <label htmlFor="dni">Natacion Adaptada</label>

              {/* Grupo de radio buttons */}
              <div>
                <input
                  type="radio"
                  name="natacionAdaptada"
                  id="no"
                  value="no"
                  onChange={(e) => {
                    setIsNatacionAdaptada(false);

                    setUsuario({
                      ...usuario,
                      natacionAdaptada: false,
                    });
                  }}
                />
                <label htmlFor="no">No</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="natacionAdaptada"
                  id="si"
                  value="si"
                  onChange={(e) => {
                    setIsNatacionAdaptada(true);

                    setUsuario({
                      ...usuario,
                      natacionAdaptada: true,
                    });
                  }}
                />
                <label htmlFor="si">Si</label>
              </div>
            </div>

            {isNatacionAdaptada ? (
              <div className="mt-3">
                <label htmlFor="dni">Diagnostico</label>
                <input
                  type="text"
                  name="diagnosticos"
                  value={usuario.diagnosticos}
                  className="form-control"
                  style={{
                    marginTop: "-10px",
                  }}
                  onChange={handleChange}
                />

                <div id="dni" className="form-text">
                  Si posee mas de un diagnostico, separarlos con una coma.
                </div>
              </div>
            ) : null}
          </>
          {/* Telefonos */}
          <>
            <div className="mt-3">
              <label htmlFor="telefono">Telefono</label>
              <input
                type="number"
                name="telefono"
                value={usuario.telefono}
                className="form-control"
                placeholder="ej: 3855966886"
                style={{
                  marginTop: "-10px",
                }}
                onChange={handleChange}
              />
            </div>
            <div className="mt-3">
              <label htmlFor="telefonoEmergencia">Telefono Emergencia</label>
              <input
                type="number"
                name="telefonoContacto"
                value={usuario.telefonoContacto}
                className="form-control"
                placeholder="ej: 3855963698"
                style={{
                  marginTop: "-10px",
                }}
                onChange={handleChange}
              />
              {errores.telefonoContacto ? (
                <div className="text-danger text-center fw-bold">
                  {errores.telefonoContacto}
                </div>
              ) : null}
            </div>
          </>

          <Barrio setUsuario={setUsuario} usuario={usuario} />

          {/* Contraseñas */}
          <>
            <div className="mt-3">
              <label
                htmlFor="Password"
                style={{
                  marginBottom: "-10px",
                }}
              >
                Contraseña
              </label>
              <div className="input-group ">
                <input
                  type={viewPass ? "text" : "password"}
                  name="password"
                  className="form-control"
                  value={usuario.password}
                  onChange={handleChange}
                  aria-describedby="basic-addon1"
                />
                <span className="input-group-text" id="basic-addon1">
                  {!viewPass ? (
                    <i
                      className="bi bi-eye"
                      style={{ fontSize: "1.5rem", cursor: "pointer" }}
                      onClick={() => setViewPass(!viewPass)}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-eye-slash"
                      style={{ fontSize: "1.5rem", cursor: "pointer" }}
                      onClick={() => setViewPass(!viewPass)}
                    ></i>
                  )}
                </span>
              </div>

              <div id="password" className="form-text">
                Te recomendamos variar entre numeros y letras para mayor
                seguridad.
              </div>
            </div>
            <div className="mt-3">
              <label
                htmlFor="Repetir Password"
                style={{
                  marginBottom: "-10px",
                }}
              >
                Repetir Contraseña
              </label>
              <div className="input-group">
                <input
                  type={viewPass2 ? "text" : "password"}
                  name="repetirPassword"
                  className="form-control"
                  value={usuario.repetirPassword}
                  onChange={handleChange}
                  aria-describedby="basic-addon1"
                />
                <span className="input-group-text" id="basic-addon1">
                  {!viewPass2 ? (
                    <i
                      className="bi bi-eye"
                      style={{ fontSize: "1.5rem", cursor: "pointer" }}
                      onClick={() => setViewPass2(!viewPass2)}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-eye-slash"
                      style={{ fontSize: "1.5rem", cursor: "pointer" }}
                      onClick={() => setViewPass2(!viewPass2)}
                    ></i>
                  )}
                </span>
              </div>

              {errores.repetirPassword ? (
                <div className="text-danger text-center fw-bold">
                  {errores.repetirPassword}
                </div>
              ) : null}
            </div>
          </>

          {registro.isLoading ? (
            <div className="text-center mt-3">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            className={`btn btn-lg ${
              isDisabled() ? "btn-secondary" : "btn-success"
            } d-block mx-auto mt-3 `}
            onClick={handleSubmit} // Utiliza el nombre correcto de la función
            disabled={isDisabled()}
          >
            Registrarse
          </button>
          {
            isDisabled() ? (
              <div className="text-center text-danger">
                Complete todos los campos para poder registrarte
              </div>
            ) : null // Si no hay errores, no se muestra nada
          }

          <div className="mt-3 text-center">
            <h5>
              ¿Ya tienes cuenta?{" "}
              <Link to="/">
                <button className="btn btn-warning mt-2">Inicia Sesion</button>
              </Link>
            </h5>
          </div>
        </form>
      </main>
    </section>
  );
}

export default RegistroPrueba;
