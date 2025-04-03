import { useEffect, useState } from "react";
import useRegister from "../../hooks/useRegister";
import InputCustom from "../InputCustom";
import Barrio from "./Barrio";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function FormularioUsuario({ user }) {
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
    <form className="needs-validation" noValidate>
      <div className="row g-3">
        <InputCustom
          label="Nombre"
          type="text"
          name="nombre"
          value={usuario.nombre}
          placeholder="ej: Juan"
          onChange={handleChange}
          required
          errores={errores.nombre}
        />

        <InputCustom
          label="Apellido"
          type="text"
          name="apellido"
          value={usuario.apellido}
          placeholder="ej: Perez"
          onChange={handleChange}
          required
          errores={errores.apellido}
        />

        <InputCustom
          label="DNI"
          type="number"
          name="dni"
          value={usuario.dni}
          placeholder="ej: 40898658"
          onChange={handleChange}
          required
          errores={errores.dni}
        />
        <div className="form-text mb-3">
          El DNI será tu usuario para iniciar sesión.
        </div>

        {!user && (
          <InputCustom
            label="Repetir DNI"
            type="number"
            name="dniRepetir"
            value={usuario.dniRepetir}
            placeholder="ej: 40898658"
            onChange={handleChange}
            required
            errores={errores.dniRepetir}
          />
        )}

        <InputCustom
          label="Teléfono"
          type="tel"
          name="telefono"
          value={usuario.telefono}
          placeholder="ej: 3855963698"
          onChange={handleChange}
          required
          errores={errores.telefono}
        />

        <InputCustom
          label="Teléfono de Contacto"
          type="tel"
          name="telefonoContacto"
          value={usuario.telefonoContacto}
          placeholder="ej: 3855963698"
          onChange={handleChange}
          errores={errores.telefonoContacto}
        />

        <InputCustom
          label="Edad"
          type="number"
          name="edad"
          value={usuario.edad}
          placeholder="ej: 25"
          onChange={handleChange}
          required
          errores={errores.edad}
        />

        <div className="col-12">
          <label htmlFor="sexo" className="form-label">
            Sexo <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errores.sexo ? "is-invalid" : ""}`}
            name="sexo"
            id="sexo"
            onChange={handleChange}
            value={usuario.sexo || ""}
            required
          >
            <option value="">-- Seleccione su sexo --</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
          {errores.sexo && (
            <div className="invalid-feedback d-block">{errores.sexo}</div>
          )}
        </div>

        <div className="col-12">
          <div className="form-label">
            Tipo de Natación <span className="text-danger">*</span>
          </div>
          <div className="btn-group" role="group">
            <input
              type="radio"
              className="btn-check"
              name="natacionAdaptada"
              id="no"
              autoComplete="off"
              checked={!isNatacionAdaptada}
              onChange={() => {
                setIsNatacionAdaptada(false);
                setUsuario((prev) => ({ ...prev, natacionAdaptada: false }));
              }}
            />
            <label className="btn btn-outline-primary" htmlFor="no">
              Natación Convencional
            </label>

            <input
              type="radio"
              className="btn-check"
              name="natacionAdaptada"
              id="si"
              autoComplete="off"
              checked={isNatacionAdaptada}
              onChange={() => {
                setIsNatacionAdaptada(true);
                setUsuario((prev) => ({ ...prev, natacionAdaptada: true }));
              }}
            />
            <label className="btn btn-outline-primary" htmlFor="si">
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
              required
              errores={errores.diagnosticos}
            />
            <div className="form-text mb-3">
              Si posee más de un diagnóstico, sepárelos con una coma.
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
            <div className="col-md-6">
              <InputCustom
                label="Contraseña"
                type={viewPass ? "text" : "password"}
                name="password"
                value={usuario.password}
                placeholder="Ingrese su contraseña"
                onChange={handleChange}
                required
                errores={errores.password}
              />
              <div className="form-text">
                <small>
                  Te recomendamos variar entre números y letras para mayor
                  seguridad.
                </small>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary mt-1"
                onClick={() => setViewPass(!viewPass)}
              >
                {viewPass ? <FaEyeSlash /> : <FaEye />}{" "}
                {viewPass ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            <div className="col-md-6">
              <InputCustom
                label="Repetir Contraseña"
                type={viewPass2 ? "text" : "password"}
                name="repetirPassword"
                value={usuario.repetirPassword}
                placeholder="Repita su contraseña"
                onChange={handleChange}
                required
                errores={errores.repetirPassword}
              />
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary mt-1"
                onClick={() => setViewPass2(!viewPass2)}
              >
                {viewPass2 ? <FaEyeSlash /> : <FaEye />}{" "}
                {viewPass2 ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-4">
        {registro.isLoading || editarPerfil.isLoading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Procesando...</p>
          </div>
        ) : !user ? (
          <>
            <button
              type="button"
              className={`btn btn-primary btn-lg w-100 ${
                isDisabled() ? "disabled" : ""
              }`}
              onClick={handleSubmit}
              disabled={isDisabled()}
            >
              Registrarse
            </button>
            {isDisabled() && (
              <div className="alert alert-warning mt-2">
                Complete todos los campos obligatorios para registrarse.
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-lg w-100"
            onClick={editarInformacionUsuario}
          >
            Guardar Cambios
          </button>
        )}
      </div>
    </form>
  );
}

export default FormularioUsuario;
