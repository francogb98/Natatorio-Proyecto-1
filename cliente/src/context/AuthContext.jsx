import { createContext, useReducer, useState } from "react";
import { fetchSinToken } from "../helpers/fetch";
import { useMutation } from "react-query";

import Swal from "sweetalert2";

import { authReducer, initialState } from "../reducer/reducer";

import { useNavigate } from "react-router-dom";
import { baseUrl } from "../helpers/url";

export const AuthContext = createContext();

const getPiletas = async () => {
  const resp = await fetch(`${baseUrl}pileta/getPiletas`);
  const data = await resp.json();
  return data;
};

export function AuthProvider({ children }) {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  const [recargando, setRecargando] = useState(false);

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

        await dispatch({
          type: "LOGIN",
          payload: { logged: true, role: usuario.role },
        });
        await dispatch({ type: "SET_USER", payload: { user: usuario } });

        if (usuario.role !== "usuario" || usuario.role !== "registrado") {
          await getPiletas();
        }

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
          text: data.message,
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

  const getInfoUser = async () => {
    try {
      if (!localStorage.getItem("token")) return;
      const resp = await fetch(
        `${baseUrl}user/infoUser/${localStorage.getItem("token")}`
      );
      const data = await resp.json();

      if (data.status == "success") {
        await dispatch({ type: "SET_USER", payload: { user: data.user } });
      }
      return data;
    } catch (error) {
      return error;
    }
  };

  const restartPagina = async () => {
    try {
      if (!localStorage.getItem("token")) return;
      const resp = await fetch(
        `${baseUrl}user/infoUser/${localStorage.getItem("token")}`
      );
      const data = await resp.json();

      if (data.status == "success") {
        await dispatch({ type: "SET_USER", payload: { user: data.user } });
        await dispatch({
          type: "LOGIN",
          payload: { logged: true, role: data.user.role },
        });
        setRecargando(false);
      }

      return data;
    } catch (error) {
      return error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth: authState,

        dispatch,
        login,
        userRefetch: getInfoUser,
        // getUser,
        restart: restartPagina,
        recargando,
        setRecargando,

        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
