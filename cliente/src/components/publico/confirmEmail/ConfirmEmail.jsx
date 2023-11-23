import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMutation } from "react-query";
import { fetchConfirmUser } from "../../../helpers/fetchConfrim";
import Swal from "sweetalert2";

function Confirm() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const confirmAccount = useMutation({
    mutationFn: fetchConfirmUser,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          title: "¡Cuenta verificada correctamente!",
          text: "Serás redirigido en 3 segundos.",
          icon: "success",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        Swal.fire({
          title: data.status.toUpperCase(),
          text: data.message + " " + "seras redirigido en 3 segundos",
          icon: data.status,
          showConfirmButton: false,
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
    },
  });

  useEffect(() => {
    confirmAccount.mutate({ token });
  }, [token]);

  return <div></div>;
}

export default Confirm;
