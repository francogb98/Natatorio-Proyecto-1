import { createContext, useReducer, useState } from "react";
import { fetchSinToken } from "../helpers/fetch";
import { useMutation } from "react-query";

import Swal from "sweetalert2";

import { authReducer, initialState } from "../reducer/reducer";

import { useNavigate } from "react-router-dom";
import { baseUrl } from "../helpers/url";
import { registrarUsuarioEnActividad } from "../helpers/usersFetch/registrarUsuarioEnActividad";

export const AuthContext = createContext();

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

        if (usuario.role === "usuario") {
          await getActividadesUsuario();
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

  const getActividadesUsuario = async () => {
    try {
      const url = `${baseUrl}activity/getActividadesNombre`;
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `${localStorage.getItem("token")}`,
        },
      });
      const { actividades } = await resp.json();
      await dispatch({
        type: "SET_ACTIVIDADES",
        payload: { actividadesUsuario: actividades },
      });

      return actividades;
    } catch (error) {
      return error;
    }
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
      await getActividadesUsuario();

      return data;
    } catch (error) {
      return error;
    }
  };

  const registerInActivity = useMutation({
    mutationKey: "registerUser",
    mutationFn: registrarUsuarioEnActividad,
    onSuccess: async (data) => {
      if (data.status === "success") {
        await getInfoUser();
        Swal.fire({
          title: "Inscripto con Exito",
          text: "Se ha inscripto correctamente en la actividad, redireccionando a pagina principal ",
          icon: data.status,
          //despues de 2 segundos lo redirecciones
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          //redirecciona al inicio
          navigate("/user/home");
        });
      } else {
        Swal.fire({
          title: data.status.toUpperCase(),
          text: data.message,
          icon: data.status,
          confirmButtonText: "Aceptar",
        });
      }
    },
    onError: (error) => {
      Swal.fire({
        title: error.status.toUpperCase(),
        text: error.message,
        icon: error.status,
        confirmButtonText: "Aceptar",
      });
    },
  });

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
        registerInActivity,

        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
