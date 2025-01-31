function UserNav({ user }) {
  return (
    <ul className="navbar-nav navbar-nav-icons flex-row">
      <li className="nav-item dropdown">
        <a
          className="nav-link lh-1 pe-0"
          id="navbarDropdownUser"
          href="#!"
          role="button"
          data-bs-toggle="dropdown"
          data-bs-auto-close="outside"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <div className="avatar avatar-l ">
            <img
              className="rounded-circle "
              src={user.foto}
              alt="perfil"
              style={{ width: "60px", height: "60px" }}
            />
          </div>
        </a>
        <div
          className="dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-profile shadow border"
          aria-labelledby="navbarDropdownUser"
        >
          <div className="card position-relative border-0">
            <div className="card-body p-0">
              <div className="text-center pt-4 pb-3">
                <div className="avatar avatar-xl ">
                  <img
                    className="rounded-circle "
                    src={user.foto}
                    alt="perfil"
                    style={{ width: "50px", height: "50px" }}
                  />
                </div>
                <h6 className="mt-2 text-body-emphasis">
                  {user.nombre} {user.apellido}
                </h6>
              </div>
            </div>
            <div
              className="overflow-auto scrollbar"
              style={{
                height: "10rem",
              }}
            >
              <ul className="nav d-flex flex-column mb-2 pb-1">
                <li className="nav-item">
                  <a className="nav-link px-3 d-block" href="#!">
                    <i className="bi bi-person"></i>
                    <span>Profile</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link px-3 d-block" href="#!">
                    <i className="bi bi-upload"></i>
                    Cargar Archivos
                  </a>
                </li>
              </ul>
            </div>
            <div className="card-footer p-0 border-top border-translucent">
              <hr />
              <div className="px-3">
                {" "}
                <a
                  className="btn btn-phoenix-secondary d-flex flex-center w-100"
                  href="#!"
                >
                  {" "}
                  <i className="bi bi-box-arrow-right"></i>
                  Cerrar Sesion
                </a>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
}

export default UserNav;
