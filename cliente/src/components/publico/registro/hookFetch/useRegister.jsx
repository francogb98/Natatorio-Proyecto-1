import { useEffect, useState } from "react";

import Swal from "sweetalert2";
import { fetchSinToken } from "../../../../helpers/fetch";
import { useMutation } from "react-query";

function useRegister() {
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    dni: "",
    dniRepetir: "",
    sexo: "",
    natacionAdaptada: "",
    diagnosticos: "",
    telefono: "",
    telefonoContacto: "",
    ciudad: "",
    barrio: "",
    password: "",
    repetirPassword: "",
  });

  const [errores, setErrores] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    dni: "",
    dniRepetir: "",
    sexo: "",
    natacionAdaptada: "",
    diagnosticos: "",
    telefono: "",
    telefonoContacto: "",
    ciudad: "",
    barrio: "",
    password: "",
    repetirPassword: "",
  });

  const [isNatacionAdaptada, setIsNatacionAdaptada] = useState(false);

  const registro = useMutation({
    mutationFn: fetchSinToken,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          title: "¡Cuenta creada correctamente!",
          text: "Serás redirigido al inicio en 2 segundos.",
          icon: "success",
          //sacar el boton de confirmacion
          showConfirmButton: false,
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);

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

  const handleChange = (e) => {
    if (e.target.name === "edad") {
      if (e.target.value.length > 2) {
        return;
      }
    }
    if (e.target.name === "dni" || e.target.name === "dniRepetir") {
      if (e.target.value.length > 8) {
        return;
      }
    }

    if (e.target.name === "dniRepetir") {
      if (usuario.dni !== e.target.value) {
        setErrores((prevErrores) => ({
          ...prevErrores,
          dniRepetir: "Los DNI no coinciden",
        }));
      } else {
        setErrores((prevErrores) => ({
          ...prevErrores,
          dniRepetir: "",
        }));
      }
    }

    if (e.target.name === "repetirPassword") {
      if (usuario.password !== e.target.value) {
        setErrores((prevErrores) => ({
          ...prevErrores,
          repetirPassword: "Las contraseñas no coinciden",
        }));
      } else {
        setErrores((prevErrores) => ({
          ...prevErrores,
          repetirPassword: "",
        }));
      }
    }

    if (e.target.name === "telefono" || e.target.name === "telefonoContacto") {
      if (e.target.value.length > 12) {
        return;
      }
    }

    //los telefonos no tienen que coincidir

    if (e.target.name === "telefonoContacto") {
      if (usuario.telefono === e.target.value) {
        setErrores((prevErrores) => ({
          ...prevErrores,
          telefonoContacto: "El telefono de contacto no puede ser igual",
        }));
      } else {
        setErrores((prevErrores) => ({
          ...prevErrores,
          telefonoContacto: "",
        }));
      }
    }

    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  useEffect(() => {}, [usuario]);

  useEffect(() => {}, [errores]);

  const handleSubmit = (e) => {
    e.preventDefault();

    //crear un objeto nuevo con los datos del usuario pero borro la propiedad dniRepetir y repetirPassword

    const usuarioNuevo = { ...usuario };
    delete usuarioNuevo.dniRepetir;
    delete usuarioNuevo.repetirPassword;

    registro.mutate({
      method: "POST",
      endpoint: "create",
      data: usuarioNuevo,
    });
  };

  const isDisabled = () => {
    if (
      usuario.nombre === "" ||
      usuario.apellido === "" ||
      usuario.edad === "" ||
      usuario.dni === "" ||
      usuario.dniRepetir === "" ||
      usuario.sexo === "" ||
      usuario.natacionAdaptada === "" ||
      usuario.telefono === "" ||
      usuario.telefonoContacto === "" ||
      usuario.ciudad === "" ||
      usuario.password === "" ||
      usuario.repetirPassword === ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  return {
    usuario,
    setUsuario,
    handleChange,
    handleSubmit,
    errores,
    registro,
    isNatacionAdaptada,
    setIsNatacionAdaptada,
    isDisabled,
  };
}

export default useRegister;
