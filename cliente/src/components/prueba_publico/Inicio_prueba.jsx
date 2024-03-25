import Main from "./Main";
import Logo from "../../assets/Logo.jpg";

function Inicio_prueba() {
  return (
    <div className="container">
      <div className="row border-bottom p-3">
        <header>
          <nav className="d-flex justify-content-between">
            <img
              src={Logo}
              alt="logo"
              style={{
                width: "250px",
              }}
            />
            <div>
              <ul class="nav">
                <li class="nav-item">
                  <button class="btn btn-primary text-white me-2">
                    Iniciar Sesion
                  </button>
                </li>
                <li class="nav-item">
                  <button class="btn btn-success text-white">
                    Registrarse
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </header>
      </div>
      <div className="row">
        <Main />
      </div>
      <div className="row">
        <footer></footer>
      </div>
    </div>
  );
}

export default Inicio_prueba;
