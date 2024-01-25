import style from "./style.module.css";

import { useState } from "react";
import { useMutation } from "react-query";
import { autorizar } from "../../../../helpers/piletas/autorizar";

import swal from "sweetalert2";

function FormularioPrueba() {
  const [id, setId] = useState("");

  const autorizarUsuario = useMutation({
    mutationFn: autorizar,
    onSuccess: (data) => {
      if (data.status === "success") {
        swal.fire({
          title: "Usuario autorizado con éxito!",
          icon: "success",
        });
      } else {
        swal.fire({
          title: "Error!",
          text: data.msg,
          icon: "error",
        });
      }
    },
  });

  return (
    <div className={style.formularioBody}>
      <h2>Autorizar Usuario</h2>
      <form
        onSubmit={(e) => {
          //accedo al valor del input
          e.preventDefault();
          const id = document.querySelector("input");

          autorizarUsuario.mutate({ id: id.value });
        }}
      >
        <label
          htmlFor=""
          style={{
            textAlign: "start",
          }}
        >
          Escribe el numero de identificacion del usuario
        </label>
        <input
          type="text"
          className="form-control"
          id="usuario"
          value={id}
          onChange={(e) => setId(e.target.value)}
          aria-describedby="emailHelp"
        />
        <button
          type="submit"
          className="btn btn-lg btn-success d-block mt-2 mx-auto"
          disabled={id === ""}
        >
          Autorizar
        </button>
        {autorizarUsuario.isLoading && (
          <div
            className="spinner-border text-primary d-block mx-auto mt-2"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default FormularioPrueba;
