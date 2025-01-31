function useActividades(actividades, filtro) {
  actividades.filter((actividad) => actividad.codigoDeAcceso == "");

  const actividadesFiltradas = actividades.filter((actividad) =>
    actividad.name.startsWith(filtro)
  );

  return { actividadesFiltradas };
}

export default useActividades;
