import { useMutation } from "react-query";
import { registrarUsuarioEnActividad } from "../../../helpers/usersFetch/registrarUsuarioEnActividad";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

import { toast } from "sonner";

function inscripcion() {
  const { userRefetch } = useContext(AuthContext);

  const registerInActivity = useMutation({
    mutationKey: "registerUser",
    mutationFn: registrarUsuarioEnActividad,
    onSuccess: async (data) => {
      if (data.status === "success") {
        await userRefetch();
        toast.success("Inscripcion realizada con exito");
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error("error en el servidor");
    },
  });

  return { registerInActivity };
}

export default inscripcion;
