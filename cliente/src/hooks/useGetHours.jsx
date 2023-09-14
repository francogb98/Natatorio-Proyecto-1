import { useQuery } from "react-query";
import { fetchConTokenHours } from "../helpers/fetch";

export const useGetHours = () => {
  const { isLoading, data, isError, error, isSuccess } = useQuery({
    queryKey: ["hours"],
    queryFn: fetchConTokenHours,
  });

  return {
    cargando: isLoading,
    horas: data,
    hayErorrHorario: isError,
    errorHorario: error,
    horaCargada: isSuccess,
  };
};
