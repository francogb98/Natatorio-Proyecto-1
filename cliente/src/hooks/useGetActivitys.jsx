import { useQuery } from "react-query";
import { fetchConToken } from "../helpers/fetch";

export const useGetActivitys = () => {
  const { isLoading, data, isError, error, isSuccess } = useQuery({
    queryKey: ["activitys"],
    queryFn: fetchConToken,
  });

  return { isLoading, data, isError, error, isSuccess };
};
