import { useEffect, useState } from "react";
import useRegister from "../../hooks/useRegister";
import InputCustom from "../InputCustom";
import Barrio from "./Barrio";

function FormularioUsuario({ user }) {
  let {
    usuario,
    setUsuario,
    handleChange,
    handleSubmit,
    errores,
    registro,
    isNatacionAdaptada,
    setIsNatacionAdaptada,
    isDisabled,
    editarInformacionUsuario,
    editarPerfil,
  } = useRegister();

  const [viewPass, setViewPass] = useState(false);
  const [viewPass2, setViewPass2] = useState(false);

  useEffect(() => {
    if (user) {
      setUsuario(user);
      setIsNatacionAdaptada(user.natacionAdaptada);
    }
  }, [user]);

  return (
    <form action="">
      <div className="row g-3">
        <InputCustom
          label="Nombre"
          type="text"
          name="nombre"
          value={usuario.nombre}
          placeholder="ej: Juan"
          onChange={handleChange}
        />

        <InputCustom
          label="Apellido"
          type="text"
          name="apellido"
          value={usuario.apellido}
          placeholder="ej: Perez"
          onChange={handleChange}
        />

        <InputCustom
          label="DNI"
          type="number"
          name="dni"
          value={usuario.dni}
          placeholder="ej: 40898658"
          onChange={handleChange}
        />
        <div id="dni" className="form-text">
          El DNI sera tu usuario para iniciar sesion.
        </div>

        {!user && (
          <InputCustom
            label="Repetir DNI"
            type="number"
            name="dniRepetir"
            value={usuario.dniRepetir}
            placeholder="ej: 40898658"
            onChange={handleChange}
            errores={errores.dniRepetir}
          />
        )}

        <InputCustom
          label="Telefono"
          type="telefono"
          name="telefono"
          value={usuario.telefono}
          placeholder="ej: 3855963698"
          onChange={handleChange}
        />

        <InputCustom
          label="Telefono de Contacto"
          type="telefonoContacto"
          name="telefonoContacto"
          value={usuario.telefonoContacto}
          placeholder="ej: 3855963698"
          onChange={handleChange}
        />

        {errores.telefonoContacto ? (
          <div className="text-danger text-center fw-bold">
            {errores.telefonoContacto}
          </div>
        ) : null}

        <InputCustom
          label="Edad"
          type="number"
          name="edad"
          value={usuario.edad}
          placeholder="ej: 25"
          onChange={handleChange}
        />

        <div className="col-12">
          <label htmlFor="dni" className={`form-label`}>
            Sexo
          </label>
          <select
            className="form-select"
            name="sexo"
            id="sexo"
            onChange={handleChange}
            defaultValue={user ? user.sexo : null}
          >
            <option value="null">--Sexo--</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className="col-12">
          <div>
            <input
              type="radio"
              name="natacionAdaptada"
              id="no"
              value="no"
              checked={!isNatacionAdaptada}
              onChange={() => {
                setIsNatacionAdaptada(false);
                setUsuario((prev) => ({ ...prev, natacionAdaptada: false }));
              }}
            />
            <label htmlFor="no" className="ms-1">
              Natación Convencional
            </label>
          </div>
          <div>
            <input
              type="radio"
              name="natacionAdaptada"
              id="si"
              value="si"
              checked={isNatacionAdaptada}
              onChange={() => {
                setIsNatacionAdaptada(true);
                setUsuario((prev) => ({ ...prev, natacionAdaptada: true }));
              }}
            />
            <label htmlFor="si" className="ms-1">
              Natación Adaptada
            </label>
          </div>
        </div>

        {isNatacionAdaptada && (
          <>
            <InputCustom
              label="Diagnóstico"
              type="text"
              name="diagnosticos"
              value={usuario.diagnosticos || ""}
              placeholder="ej: Autismo, Síndrome de Down"
              onChange={handleChange}
            />
            <div id="diagnosticos" className="form-text">
              Si posee más de un diagnóstico, sepáralos con una coma.
            </div>
          </>
        )}

        <Barrio
          setUsuario={setUsuario}
          usuario={user ? user : usuario}
          handleChange={handleChange}
        />

        {!user && (
          <>
            <div className="col-sm-6">
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
            <div className="col-sm-6">
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
        )}
      </div>

      {registro.isLoading ? (
        <div className="text-center mt-3">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : null}

      {editarPerfil.isLoading ? (
        <div className="text-center mt-3">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : null}

      {!user ? (
        <>
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
        </>
      ) : (
        <button
          type="button"
          className={`btn btn-lg btn-primary d-block mx-auto mt-3 `}
          onClick={editarInformacionUsuario} // Utiliza el nombre correcto de la función
        >
          Editar Informacion
        </button>
      )}
    </form>
  );
}

export default FormularioUsuario;
