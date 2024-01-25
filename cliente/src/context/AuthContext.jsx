import { createContext, useState, useReducer } from "react";
import { fetchSinToken } from "../helpers/fetch";
import { useMutation } from "react-query";

import Swal from "sweetalert2";

import { authReducer } from "../reducer/reducer";

import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const initialState = {
  logged: false,
  role: "usuario",
  user: {},
};

export function AuthProvider({ children }) {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  const navigate = useNavigate();

  const [user, setUser] = useState({});

  const registro = useMutation({
    mutationFn: fetchSinToken,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          title: "Cuenta Creada",
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
    return navigate("/");
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
