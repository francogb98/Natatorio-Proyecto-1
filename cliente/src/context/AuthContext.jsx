import { createContext, useReducer } from "react";
import { fetchSinToken } from "../helpers/fetch";
import { useMutation } from "react-query";

import Swal from "sweetalert2";

import { authReducer, initialState } from "../reducer/reducer";

import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  const navigate = useNavigate();
  const login = useMutation({
    mutationFn: fetchSinToken,
    onSuccess: async (data) => {
      if (data.status === "success") {
        if (data.usuario.role === "suspendido") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Tu cuenta esta suspendida, contacta con el administrador",
          });
          return;
        }

        localStorage.setItem("token", data.token);
        const { usuario } = data;

        await dispatch({ type: "LOGIN", payload: { role: usuario.role } });
        await dispatch({ type: "SET_USER", payload: { user: usuario } });

        Swal.fire({
          icon: "success",
          title: "Bienvenido",
          text: "Iniciaste sesion correctamente, seras redirigido al home",
          showConfirmButton: false,
        });

        setTimeout(() => {
          Swal.close();
          if (
            data.usuario.role === "usuario" ||
            data.usuario.role === "registrado"
          ) {
            return navigate("/user/home");
          }
          return navigate("/admin/panel/inicio");
          // window.location.href = "/home";
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error en el sevidor, por favor intente mas tarde",
        });
      }
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
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
        auth: authState,

        dispatch,
        login,
        // getUser,

        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
