import style from "./home.module.css";
import { Outlet } from "react-router-dom";

import NavBar from "./NavBar";
import { useQuery } from "react-query";
import { getInfoUser } from "../../helpers/fetch";

function Home() {
  const getUser = useQuery({
    queryKey: ["getUser"],
    queryFn: getInfoUser,
    staleTime: 0,
  });

  console.log(getUser);

  if (getUser.isLoading) {
    return <h1>Cargando...</h1>;
  }

  if (getUser.isError) {
    return <h1>Hubo un error</h1>;
  }

  if (getUser.isSuccess) {
    return (
      <div className={style.bodyHome}>
        <NavBar usuario={getUser.data.user} />

        <div className={style.main}>
          <Outlet />
        </div>
      </div>
    );
  }
}

export default Home;
