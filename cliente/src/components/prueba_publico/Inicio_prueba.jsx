import Actividades_lista from "./Actividades_lista";
import Logo from "../../assets/Logo.jpg";

function Inicio_prueba() {
  return (
    <div className="container mt-2">
      <header className="row text-center text-md-start">
        <div className="col-12 col-sm-6 mb-2">
          <img
            src={Logo}
            alt="logo"
            style={{
              width: "250px",
              height: "50px",
            }}
          />
        </div>
        <div className="col-12 col-sm-6">
          <nav className=" d-flex justify-content-center justify-content-md-end ">
            <ul class="nav">
              <li class="nav-item">
                <button class="btn btn-primary text-white me-2">
                  Iniciar Sesion
                </button>
              </li>
              <li class="nav-item">
                <button class="btn btn-success text-white">Registrarse</button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="row">
        <Actividades_lista />
      </div>
      <div className="row">
        <footer></footer>
      </div>
    </div>
  );
}

export default Inicio_prueba;
