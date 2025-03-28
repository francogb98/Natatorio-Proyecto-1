import { createContext, useReducer, useState } from "react";
import { useMutation, useQuery } from "react-query";

import Swal from "sweetalert2";

import { authReducer, initialState } from "../reducer/reducer";

import { useNavigate } from "react-router-dom";
import { UserFetch } from "../helpers/UserFetchConClases/FETCH-publico/UserFetch";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [imageModal, setImageModal] = useState("");

  const [authState, dispatch] = useReducer(authReducer, initialState);

  const [recargando, setRecargando] = useState(false);

  const navigate = useNavigate();
  const login = useMutation({
    mutationFn: UserFetch.login,
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

        document.querySelector('[data-bs-dismiss="modal"]').click(); // Cierra el modal
        Swal.fire({
          icon: "success",
          title: "Bienvenido",
          text: "Iniciaste sesion correctamente, seras redirigido al home",
          showConfirmButton: false,
        });

        localStorage.setItem("modal", true);

        setTimeout(() => {
          Swal.close();
          if (
            data.usuario.role === "usuario" ||
            data.usuario.role === "registrado"
          ) {
            return navigate("/");
          }
          return navigate("/dashboard");
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
    if (!localStorage.getItem("token")) return;
    const data = await UserFetch.getInfoUser();
    if (data.status == "success") {
      dispatch({ type: "SET_USER", payload: { user: data.user } });
    }

    return data.user;
  };

  const restartPagina = async () => {
    try {
      if (!localStorage.getItem("token")) return;
      const data = await UserFetch.getInfoUser();

      if (data.status == "success") {
        dispatch({ type: "SET_USER", payload: { user: data.user } });
        dispatch({
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

  const useUser = () => {
    return useQuery({
      queryKey: ["user"], // Clave única para React Query
      queryFn: getInfoUser, // Función que obtiene el usuario
      retry: false, // No reintentar si falla
    });
  };

  return (
    <AuthContext.Provider
      value={{
        auth: authState,
        useUser,

        dispatch,
        login,
        userRefetch: getInfoUser,
        // getUser,
        restart: restartPagina,
        recargando,
        setRecargando,

        cerrarSesion,
        imageModal,
        setImageModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
