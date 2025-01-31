import { useContext } from "react";
import FormularioUsuario from "../../../components/user/FormularioUsuario";
import { AuthContext } from "../../../../context/AuthContext";

function PageUser() {
  const {
    auth: { user },
  } = useContext(AuthContext);

  return (
    <>
      <h2 className="text-center">Informacion Usuario</h2>
      <FormularioUsuario user={user} />
    </>
  );
}

export { PageUser };
