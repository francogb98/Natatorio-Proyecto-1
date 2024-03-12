import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { baseUrl } from "../../../helpers/url";

export const getUser = async (id) => {
  try {
    const response = await fetch(`${baseUrl}user/getinfoUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
};

function info_user_perfil() {
  const [perfilUsuario, setPerfilUsuario] = useState(false);

  const buscar_usuario = useMutation({
    mutationFn: getUser,
  });

  useEffect(() => {}, [perfilUsuario]);

  return { perfilUsuario, setPerfilUsuario, buscar_usuario };
}

export default info_user_perfil;
