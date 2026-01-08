import React from "react";

import { useQuery } from "react-query";
import { useContext, useState, useEffect } from "react";
import { ActividadesFetch } from "../../../helpers/activitiesFetch/Actividades-fetch-class";
import ActividadesLista from "./ActividadesLista";
import { ModalIniciarSesion, FormSearch } from "../../components/Actividades";
import Loading from "../../components/Loader/Loading";
import { AuthContext } from "../../../context/AuthContext";
import SelectForm from "../../components/Actividades/SelectForm";
import { Actividad } from "../../models";

function Layout() {
  const {
    auth: { user },
  } = useContext(AuthContext);

  const { data, isLoading } = useQuery({
    queryKey: "actividades",
    queryFn: ActividadesFetch.getActivitiesSinToken,
    refetchOnWindowFocus: false,
  });

  const [filtro, setFiltro] = useState("");
  const [actividadesParaUsuarios, setActividadesParaUsuarios] = useState<
    Actividad[]
  >([]);
  const [nombreActividades, setNombreActividades] = useState<string[]>([]);
  const [filter, setFilter] = useState({
    name: "default",
    hour: "default",
    day: "default",
  });

  useEffect(() => {
    if (data?.actividades) {
      const sortedActivities = data.actividades.sort((a, b) => {
        const dateA = new Date(`1970-01-01T${a.hourStart}`);
        const dateB = new Date(`1970-01-01T${b.hourStart}`);
        return dateA.getTime() - dateB.getTime();
      });

      setActividadesParaUsuarios(
        sortedActivities.filter((actividad: Actividad) => {
          const filtroEdad =
            user && user.edad
              ? user.edad >= actividad.desde! && user.edad <= actividad.hasta!
              : true;

          const filtroNatacionAdaptada = user?.natacionAdaptada
            ? actividad.natacionAdaptada === true
            : actividad.natacionAdaptada !== true;

          return (
            actividad.codigoDeAcceso === "" &&
            filtroEdad &&
            filtroNatacionAdaptada &&
            actividad.actividadHabilitada
          );
        })
      );
    }
  }, [data, user]);

  useEffect(() => {
    setNombreActividades(
      Array.from(new Set(actividadesParaUsuarios.map((act) => act.name)))
    );
  }, [actividadesParaUsuarios]);

  if (isLoading || actividadesParaUsuarios.length == 0) {
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

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };
  let filteredActivities = [];
  if (filtro !== "") {
    filteredActivities = data?.actividades.filter((actividad: Actividad) => {
      const filtroNombre = filtro
        ? actividad.codigoDeAcceso === filtro ||
          (actividad.name.startsWith(filtro) && actividad.codigoDeAcceso === "")
        : true;

      const filtroEdad =
        user && user.edad
          ? user.edad >= actividad.desde! && user.edad <= actividad.hasta!
          : true;

      const filtroNatacionAdaptada = user?.natacionAdaptada
        ? actividad.natacionAdaptada === true
        : actividad.natacionAdaptada !== true;

      return (
        filtroNombre &&
        filtroEdad &&
        filtroNatacionAdaptada &&
        actividad.actividadHabilitada
      );
    });
  } else {
    filteredActivities = actividadesParaUsuarios.filter(
      (actividad: Actividad) => {
        let filtroEdad =
          user && user.edad
            ? user.edad >= actividad.desde! && user.edad <= actividad.hasta!
            : true;

        return Object.entries(filter).every(([key, value]) => {
          if (value === "default") return true && filtroEdad;
          if (key === "day") {
            return actividad.date.includes(value) && filtroEdad;
          }
          if (key === "hour")
            return actividad.hourStart === value && filtroEdad;
          if (key === "name") return actividad.name === value && filtroEdad;
          return true && filtroEdad;
        });
      }
    );
  }

  return (
    <div
      className="container g-2"
      style={{ marginTop: `${user.customId ? "10px" : "80px"}` }}
    >
      <div className="row">
        <label htmlFor="" className="form-label ms-2 fw-bold">
          Buscar actividades
        </label>
        <FormSearch filtro={filtro} setFiltro={setFiltro} />
      </div>
      <div className="row pt-3">
        <SelectForm
          nombreActividades={nombreActividades}
          handleFilter={handleFilter}
        />
        <ActividadesLista actividades={filteredActivities} />
        {filteredActivities.length === 0 && (
          <h4 className="alert alert-warning text-center">
            No se encontraron actividades con este filtro
          </h4>
        )}
      </div>
      <ModalIniciarSesion />
    </div>
  );
}

export default Layout;
