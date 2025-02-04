import { useContext, useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import { Toaster } from "sonner";

function LoginForm({ label }) {
  const { login } = useContext(AuthContext);

  const [viewPass, setViewPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));

    if (data.dni.length === 0 || data.password.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos son obligatorios",
      });
      return;
    }

    login.mutate({
      endpoint: "login",
      data,
      method: "POST",
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2 className="mb-3">{label}</h2>

        <div className="form-floating my-3">
          <input
            type="dni"
            className="form-control"
            name="dni"
            placeholder="name@example.com"
          />
          <label>DNI</label>
        </div>
        <div className="input-group mb-3">
          <input
            type={viewPass ? "text" : "password"}
            name="password"
            placeholder="password"
            className="form-control"
          />
          <span className="input-group-text" id="basic-addon1">
            {!viewPass ? (
              <i
                className="bi bi-eye ms-1"
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
                onClick={() => setViewPass(!viewPass)}
              ></i>
            ) : (
              <i
                className="bi bi-eye-slash ms-1"
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
                onClick={() => setViewPass(!viewPass)}
              ></i>
            )}
          </span>
        </div>

        <div className="mt-2" data-bs-dismiss="modal" aria-label="Close">
          <NavLink
            to="/olvidar-password"
            className="text-decoration-underline text-primary"
          >
            Olvide mi contraseña
          </NavLink>
        </div>

        <small type="button" data-bs-dismiss="modal" aria-label="Close">
          ¿No tienes cuenta? <NavLink to={"/register"}>Registrate</NavLink>
        </small>

        {login.isLoading && (
          <div>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          </div>
        )}
        <button
          className="btn btn-lg btn-primary py-2 d-block mx-auto mt-2"
          type="submit"
          disabled={login.isLoading} // Deshabilita el botón mientras carga
        >
          Ingresar
        </button>
      </form>
    </>
  );
}

LoginForm.propTypes = {
  label: PropTypes.string.isRequired,
};

export default LoginForm;
