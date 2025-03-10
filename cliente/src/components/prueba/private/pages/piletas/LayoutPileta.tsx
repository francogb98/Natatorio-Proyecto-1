import { info_tablas } from "../../../helpers/info_tablas.fetch";
import React from "react";
import { useQuery } from "react-query";

import { Pileta } from "../../../models";
import TablaPileta from "./TablaPileta";

function LayoutPileta() {
  const info_pileta = useQuery({
    queryKey: ["piletas"],
    queryFn: info_tablas,
  });

  if (info_pileta.isLoading) {
    return <div>Cargando...</div>;
  }

  if (info_pileta.isError) {
    return <div>Error al cargar la informacion de las piletas</div>;
  }

  return (
    <div>
      {info_pileta.data.resultado.map((data: Pileta) => (
        <div key={data.pileta}>
          <h2 className="text-center">
            {data.pileta.charAt(0).toUpperCase() + data.pileta.slice(1)}
          </h2>
          {data.users?.length === 0 || !data.users ? (
            <div className="alert alert-info" role="alert">
              No hay usuarios en esta pileta
            </div>
          ) : (
            <TablaPileta users={data.users} key={data._id} />
          )}
        </div>
      ))}
    </div>
  );
}

export default LayoutPileta;
