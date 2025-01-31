import { useQuery } from "react-query";
import { useContext, useState } from "react";

import { ActividadesFetch } from "../../../helpers/activitiesFetch/Actividades-fetch-class";

import ActividadesLista from "./ActividadesLista";
import { ModalIniciarSesion, FormSearch } from "../../components/Actividades";
import Loading from "../../components/Loader/Loading";
import { AuthContext } from "../../../context/AuthContext";

function Layout() {
  const {
    auth: { user },
  } = useContext(AuthContext);

  const { data, isLoading } = useQuery({
    queryKey: "actividades",
    queryFn: ActividadesFetch.getActivitiesSinToken,
    //quiero que no se ejecute cada vez que se renderiza el componente
    refetchOnWindowFocus: false,
  });
  const [filtro, setFiltro] = useState("");

  if (isLoading) {
    return (
      <div className="container">
        <div className="row">
          <Loading>
            <h4 className="fw-bold mb-4">Cargando Actividades...</h4>
          </Loading>
        </div>
      </div>
    );
  }

  if (data && data.status === "success") {
    const actividades = data.actividades.filter((actividad) => {
      const tieneCodigo = actividad.codigoDeAcceso == "";
      const estaHabilitada = actividad.actividadHabilitada;

      return tieneCodigo && estaHabilitada;
    });

    const actividadesFiltradas = data.actividades.filter((actividad) => {
      const filtroNombre = filtro
        ? actividad.codigoDeAcceso === filtro ||
          (actividad.name.startsWith(filtro) && actividad.codigoDeAcceso === "")
        : true;

      const filtroEdad =
        user && user.edad
          ? user.edad >= actividad.desde && user.edad <= actividad.hasta
          : true;

      const estaHabilitada = actividad.actividadHabilitada;

      return filtroNombre && filtroEdad && estaHabilitada;
    });

    {
      return (
        <div className="container g-2">
          <div className="row">
            <h2 className="text-center">Lista de Actividades</h2>
            <FormSearch filtro={filtro} setFiltro={setFiltro} />
          </div>
          <div className="row">
            <ActividadesLista
              actividades={filtro ? actividadesFiltradas : actividades}
            />
            {actividadesFiltradas.length === 0 && (
              <h4 className="alert alert-warning text-center">
                No se encontraron actividades con este nombre
                <span className="text-danger mx-2">O</span>
                no cumple con los requisitos para dicha actividad (edad)
              </h4>
            )}
          </div>

          <ModalIniciarSesion />
        </div>
      );
    }
  }

  return <h1>Error al cargar las actividades</h1>;
}

export default Layout;
