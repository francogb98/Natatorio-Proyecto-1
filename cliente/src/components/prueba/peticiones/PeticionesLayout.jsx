import { useQuery } from "react-query";
import { peticiones } from "../../../helpers/Peticiones/peticiones.helpers";
import PeticionCard from "./PeticionCard";

import style from "./peticiones.module.css";
import { useEffect, useState } from "react";

function PeticionesLayout() {
  const [estado, setEstado] = useState("pendiente");

  const { data, isLoading, isError, isSuccess, refetch } = useQuery({
    queryKey: ["peticiones"],
    queryFn: () => peticiones.getPeticiones(estado),
  });

  const handleChange = (e) => {
    setEstado(e.target.value);
  };

  useEffect(() => {
    refetch();
  }, [estado]);

  if (isError) {
    return <div>Ocurrio un error</div>;
  }

  if (isSuccess && data) {
    console.log(data);
    return (
      <div>
        <header className={style.header}>
          <h2>Solicitudes</h2>
          <select
            className="form-select"
            name="estado"
            id="estado"
            onChange={handleChange}
          >
            <option value="pendiente">--seleccione un asunto--</option>
            <option value="pendiente">Pendiente</option>
            <option value="aceptado">Aceptado</option>
            <option value="denegado">Denegado</option>
          </select>
        </header>
        {isLoading ? (
          <div className={style.loading}>
            <h3>Cargando solicitudes</h3>
            <div className="spinner-border text-primary mt-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className={style.cards__container}>
              {data.peticiones.length > 0 ? (
                data.peticiones.map((peticion) => (
                  <div key={peticion._id}>
                    <PeticionCard peticion={peticion} />
                  </div>
                ))
              ) : (
                <div>No se encontraron solicitudes con este estado</div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
}

export { PeticionesLayout };
