import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useMutation, useQuery } from "react-query";
import { getPiletas } from "../../../helpers/piletas/getPiletas";
import getUsersFromActivity from "../../../helpers/activitiesFetch/getUsersFromActivity";

const useDiaYHoraActual = () => {
  const [horaActual, setHoraActual] = useState(dayjs().format("HH"));

  //hago un fetch cpon la hora actual

  const { data, isLoading, isError, refetch, isRefetching } = useQuery(
    "getHoraActual",
    getPiletas
  );

  const [diaActualEnEspanol, setDiaActualEnEspanol] = useState(
    dayjs().locale("es").format("dddd")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const nuevaHora = dayjs().format("HH");

      if (nuevaHora !== horaActual) {
        setHoraActual(nuevaHora);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [horaActual]);

  return {
    data,
    refetch,
    isLoading,
    isRefetching,
    horaActual,
    diaActualEnEspanol:
      diaActualEnEspanol.charAt(0).toUpperCase() + diaActualEnEspanol.slice(1),
  };
};

export default useDiaYHoraActual;
