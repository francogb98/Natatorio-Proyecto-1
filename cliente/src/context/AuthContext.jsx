import React, { createContext, useState, useReducer } from "react";
import {
  fetchConToken,
  fetchConTokenHours,
  fetchSinToken,
  getInfoUser,
} from "../helpers/fetch";
import { useMutation, useQuery } from "react-query";

import Swal from "sweetalert2";
import { sendEmail } from "../helpers/sendEmail";

import { authReducer } from "../reducer/reducer";

export const AuthContext = createContext();

const initialState = {
  logged: false,
  role: "usuario",
  user: {},
};

export function AuthProvider({ children }) {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  const [user, setUser] = useState({});

  const registro = useMutation({
    mutationFn: fetchSinToken,
    onSuccess: (data) => {
      if (data.status === "success") {
        sendEmail(data);
        Swal.fire({
          title: data.status.toUpperCase(),
          text: "Se ha enviado un correo de confirmacion a tu email",
          icon: data.status,
          confirmButtonText: "Aceptar",
        });

        return true;
      } else {
        Swal.fire({
          title: data.status.toUpperCase(),
          text: data.message,
          icon: data.status,
          confirmButtonText: "Aceptar",
        });
      }
    },
  });

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    //redirigir al login
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        registro,
        auth: authState,
        dispatch,
        // getUser,
        user,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
