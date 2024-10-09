import React, { useContext, useState } from "react";

import { Toaster, toast } from "sonner";
import { useMutation } from "react-query";
import { UserFetch } from "../../../helpers/UserFetchConClases/FETCH-publico/UserFetch";
import { AuthContext } from "../../../context/AuthContext";

function EditarDatos({ user }) {
  const { userRefetch } = useContext(AuthContext);

  const editar = useMutation({
    mutationFn: UserFetch.editar_informacion,

    onSuccess: (data) => {
      toast.success("Informacion actualizada");
      userRefetch();
    },
    onError: () => {
      toast.error("Error en el servidor");
      userRefetch();
    },
  });

  const [userInfo, setUserInfo] = useState({
    nombre: user.nombre,
    apellido: user.apellido,
    edad: user.edad,
    sexo: user.sexo,
    natacionAdaptada: user.natacionAdaptada ? true : false,
    telefono: user.telefono,
    telefonoContacto: user.telefonoContacto,
    barrio: user.barrio ?? "",
    ciudad: user.ciudad,
    dni: user.dni,
  });

  const handleChange = (e) => {
    const { name, checked, value } = e.target;

    if (name == "natacionAdaptada") {
      setUserInfo((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else {
      setUserInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    for (const [key, value] of formData.entries()) {
      // Aquí puedes manejar los datos como desees,
      // por ejemplo, actualizar el estado de tu componente
      setUserInfo((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    }

    toast.info("Actualizando informacion");

    editar.mutate({ body: userInfo, filtro: "datos" });
  };

  return (
    <>
      <form action="" className="d-flex flex-column " onSubmit={handleSubmit}>
        <button
          type="submit"
          className="btn btn-primary my-2"
          style={{ width: "fit-content" }}
        >
          Guardar
        </button>
        <div>
          <label className="form-label" htmlFor="nombre">
            Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={userInfo.nombre}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="apellido">
            Apellido:
          </label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={userInfo.apellido}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="edad">
            Edad:
          </label>
          <input
            type="number"
            id="edad"
            name="edad"
            value={userInfo.edad}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-1">
          <label className="form-label" htmlFor="sexo">
            Sexo:
          </label>

          <select
            id="sexo"
            name="sexo"
            value={userInfo.sexo}
            onChange={handleChange}
          >
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className="mb-3">
          <div>
            <label htmlFor="no">Natacion Convencional</label>
            <input
              type="radio"
              name="natacionAdaptada"
              checked={!userInfo.natacionAdaptada}
              id="no"
              value="no"
              onChange={() => {
                setUserInfo((prevState) => ({
                  ...prevState,
                  natacionAdaptada: false,
                }));
              }}
            />
          </div>
          <div>
            <label htmlFor="si">Natacion Adaptada</label>
            <input
              type="radio"
              name="natacionAdaptada"
              checked={userInfo.natacionAdaptada}
              id="si"
              value="si"
              onChange={() => {
                setUserInfo((prevState) => ({
                  ...prevState,
                  natacionAdaptada: true,
                }));
              }}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="telefono">
            Telefono:
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={userInfo.telefono}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="telefonoContacto">
            Telefono de emergencia:
          </label>
          <input
            type="tel"
            id="telefonoContacto"
            name="telefonoContacto"
            value={userInfo.telefonoContacto}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="barrio">
            Barrio:
          </label>
          <input
            type="text"
            id="barrio"
            name="barrio"
            value={userInfo.barrio ?? ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="ciudad">
            Ciudad:
          </label>
          <input
            type="text"
            id="ciudad"
            name="ciudad"
            value={userInfo.ciudad ?? ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="dni">
            DNI:
          </label>
          <input
            type="text"
            id="dni"
            name="dni"
            value={userInfo.dni}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        {/* <div className="mb-3">
          <label className="form-label" htmlFor="diagnostico">Diagnóstico:</label>
          <textarea id="diagnostico" value={userInfo.diagnostico ?? ""}></textarea>
        </div> */}
        <button
          type="submit"
          className="btn btn-primary my-2"
          style={{ width: "fit-content" }}
        >
          Guardar
        </button>
      </form>

      <Toaster position="bottom-left" richColors />
    </>
  );
}

export default EditarDatos;
