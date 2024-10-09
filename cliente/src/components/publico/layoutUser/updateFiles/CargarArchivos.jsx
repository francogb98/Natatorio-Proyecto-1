import { useState, useEffect, useContext } from "react";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { AuthContext } from "../../../../context/AuthContext";
import { UserFetch } from "../../../../helpers/UserFetchConClases/FETCH-publico/UserFetch";

function CargarArchivos() {
  const { auth, dispatch } = useContext(AuthContext);

  const [imagen, setImagen] = useState();

  const [success, setSuccess] = useState(false);

  const [editarFotoPerfil, setEditarFotoPerfil] = useState(false);
  const [editarDocumento, setEditarDocumento] = useState(false);
  const [editarCud, setEditarCud] = useState(false);
  const [editarHongos, setEditarHongos] = useState(false);
  const [editarFicha, setEditarFicha] = useState(false);

  const subirArchivo = async (e) => {
    e.preventDefault();

    //verifico que el archivo sea una imagen
    if (
      e.target.files[0].type !== "image/png" &&
      e.target.files[0].type !== "image/jpg" &&
      e.target.files[0].type !== "image/jpeg"
    ) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "El archivo no es una imagen",
        showConfirmButton: true,
        timer: 1500,
      });
      return;
    }

    if (e.target.files[0].size > 4000000) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "El archivo pesa mas de 4mb",
        showConfirmButton: true,
        timer: 1500,
      });
      return;
    }

    const archivoConNuevoNombre = new File([e.target.files[0]], e.target.name, {
      type: e.target.files[0].type,
    });

    const formData = new FormData();
    formData.append("archivo", archivoConNuevoNombre);

    mutation.mutate(formData);
  };

  const mutation = useMutation(UserFetch.updateFile, {
    onSuccess: (data) => {
      dispatch({ type: "SET_USER", payload: { user: data.user } });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Archivo subido con exito",
        showConfirmButton: true,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error al subir el archivo",
        showConfirmButton: true,
        timer: 1500,
      });
    },
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      setEditarFotoPerfil(false);
      setEditarFicha(false);
      setEditarDocumento(false);
      setEditarCud(false);
      setEditarHongos(false);
      setTimeout(() => {
        setSuccess(false);
      }, 1500);
    }
  }, [mutation.isSuccess]);

  return (
    <>
      <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={"/user/perfil"}>Perfil</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <strong>Cargar Archivos</strong>
            </li>
          </ol>
        </nav>
        {mutation.isLoading ? (
          <div
            className="alert alert-primary text-center"
            role="alert"
            style={{
              //que aparezca fijo arriba
              position: "sticky",
              top: "0",
              zIndex: "1",
            }}
          >
            <h4 className="fw-bold">Cargando archivo por favor espere...</h4>
            <img
              src="https://media3.giphy.com/media/huOej08UYQYtAjH22E/giphy.gif?cid=ecf05e4722zlimap43nxwgs1uw1zfah471tybh9f7d5c2iap&amp;ep=v1_gifs_related&amp;rid=giphy.gif&amp;ct=s"
              // alt="Water Swimming Sticker by MySwimPro"
              // style="width: 500px; height: 281.25px; left: 0px; top: 0px;"
              style={{
                width: "60%",
              }}
            />
          </div>
        ) : (
          <>
            <div className="alert alert-warning">
              <h5 className="alert-heading">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Importante
              </h5>
              <p>
                <strong>
                  Para poder inscribirte a las actividades, debes cargar los
                  siguientes archivos
                </strong>
                (por unica vez):
              </p>
              <ul>
                <li>
                  <strong>Foto de perfil</strong>
                </li>

                <li>
                  <strong>Documento</strong> (parte frontal)
                </li>

                <li>
                  <strong>CUD</strong> (Certificado Único de Discapacidad) en
                  caso de tenerlo
                </li>
                <li>
                  <strong>Certificado de pediculosis y micosis</strong> (con la
                  firma del médico, se debe actualizar cada 1 mes)
                </li>
                <li>
                  <strong>Ficha médica completa</strong> (descargarla desde el
                  botón de abajo)
                </li>
              </ul>

              <hr />
              <p className="mb-0">
                <strong>
                  <i className="bi bi-exclamation-circle-fill me-2"></i>A la par
                  de cada archivo, se encuentra un ícono que indica si el
                  archivo fue cargado correctamente
                </strong>
              </p>
            </div>

            {auth.user.natacionAdaptada && (
              <>
                {auth.user.cud && !editarCud && (
                  <div className="mb-3">
                    <h5 className="form-label fw-bold">
                      CUD Cargado{" "}
                      {auth.user.cud ? (
                        <i
                          className="bi bi-check-circle-fill text-success"
                          style={{ fontSize: "1.5rem" }}
                        ></i>
                      ) : (
                        <i
                          className="bi bi-x-circle-fill text-danger"
                          style={{ fontSize: "1.5rem" }}
                        ></i>
                      )}
                    </h5>
                    <div>
                      <button
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() => setImagen(auth.user.cud)}
                      >
                        Ver Imagen
                      </button>
                      <button
                        className="btn btn-warning ms-3"
                        onClick={() => setEditarCud(true)}
                      >
                        Editar Imagen
                      </button>
                    </div>
                  </div>
                )}

                {(!auth.user.cud || editarCud) && (
                  <div className="mb-3">
                    <h5 className="form-label">Cargar CUD</h5>
                    <input
                      className="form-control"
                      type="file"
                      id="formFile"
                      name="cud"
                      onChange={subirArchivo}
                    />
                  </div>
                )}
              </>
            )}

            {auth.user.foto && !editarFotoPerfil && (
              <div className="mb-3">
                <h5 className="form-label fw-bold">
                  Foto de perfil Cargada{" "}
                  {auth.user.foto ? (
                    <i
                      className="bi bi-check-circle-fill text-success"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-x-circle-fill text-danger"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  )}
                </h5>
                <div>
                  <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => setImagen(auth.user.foto)}
                  >
                    Ver Imagen
                  </button>
                  <button
                    className="btn btn-warning ms-3"
                    onClick={() => setEditarFotoPerfil(true)}
                  >
                    Editar Imagen
                  </button>
                </div>
              </div>
            )}

            {(!auth.user.foto || editarFotoPerfil) && (
              <div className="mb-5">
                <h5 className="form-label fw-bold">
                  Subir foto de perfil usuario{" "}
                  {auth.user.foto ? (
                    <i
                      className="bi bi-check-circle-fill text-success"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-x-circle-fill text-danger"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  )}
                </h5>
                <input
                  className="form-control"
                  type="file"
                  name="foto"
                  id="formFile"
                  onChange={subirArchivo}
                />
              </div>
            )}

            {auth.user.fotoDocumento && !editarDocumento && (
              <div className="mb-3">
                <h5 className="form-label fw-bold">
                  Foto de documento cargada{" "}
                  {auth.user.fotoDocumento ? (
                    <i
                      className="bi bi-check-circle-fill text-success"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-x-circle-fill text-danger"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  )}
                </h5>
                <div>
                  <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => setImagen(auth.user.fotoDocumento)}
                  >
                    Ver Imagen
                  </button>
                  <button
                    className="btn btn-warning ms-3"
                    onClick={() => setEditarDocumento(true)}
                  >
                    Editar Imagen
                  </button>
                </div>
              </div>
            )}

            {(!auth.user.fotoDocumento || editarDocumento) && (
              <div className="mb-5">
                <h5 className="form-label fw-bold">
                  Subir foto del documento (parte frontal){" "}
                  {auth.user.fotoDocumento ? (
                    <i
                      className="bi bi-check-circle-fill text-success"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-x-circle-fill text-danger"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  )}
                </h5>
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  name="fotoDocumento"
                  onChange={subirArchivo}
                />
              </div>
            )}

            {auth.user.certificadoHongos && !editarHongos && (
              <div className="mb-3">
                <h5 className="form-label fw-bold">
                  Certificado de pediculosis y micosis{" "}
                  {auth.user.certificadoHongos ? (
                    <i
                      className="bi bi-check-circle-fill text-success"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-x-circle-fill text-danger"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  )}
                </h5>
                <div>
                  <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => setImagen(auth.user.certificadoHongos)}
                  >
                    Ver Imagen
                  </button>
                  <button
                    className="btn btn-warning ms-3"
                    onClick={() => setEditarHongos(true)}
                  >
                    Editar Archivo
                  </button>
                </div>
              </div>
            )}

            {(!auth.user.certificadoHongos || editarHongos) && (
              <div className="mb-5">
                <h5 className="form-label fw-bold">
                  Subir Certificado de pediculosis y micosis{" "}
                  {auth.user.certificadoHongos ? (
                    <i
                      className="bi bi-check-circle-fill text-success"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-x-circle-fill text-danger"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  )}
                </h5>
                <input
                  className="form-control"
                  type="file"
                  name="certificadoHongos"
                  onChange={subirArchivo}
                />
              </div>
            )}

            {auth.user.fichaMedica && !editarFicha && (
              <div className="mb-3">
                <h5 className="form-label fw-bold">
                  Ficha medica cargada{" "}
                  {auth.user.fichaMedica ? (
                    <i
                      className="bi bi-check-circle-fill text-success"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-x-circle-fill text-danger"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  )}
                </h5>
                <div>
                  <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => setImagen(auth.user.fichaMedica)}
                  >
                    Ver Archivo
                  </button>
                  <button
                    className="btn btn-warning ms-3"
                    onClick={() => setEditarFicha(true)}
                  >
                    Editar Archivo
                  </button>
                </div>
              </div>
            )}

            {(!auth.user.fichaMedica || editarFicha) && (
              <div className="mb-5">
                <h5 className="form-label fw-bold">
                  Subir Ficha Medica (completada){" "}
                  {auth.user.fichaMedica ? (
                    <i
                      className="bi bi-check-circle-fill text-success"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-x-circle-fill text-danger"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  )}
                </h5>
                <input
                  className="form-control"
                  type="file"
                  name="fichaMedica"
                  onChange={subirArchivo}
                />

                <div className="mt-2 text-danger">
                  <a
                    className="btn btn-danger"
                    href="https://drive.google.com/uc?export=download&id=1ZsdIYcF75YOX7tFgCV_Qxh0tLrOCFIq0"
                    download="fichaMedica.pdf"
                  >
                    Descargar ficha médica
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <img
                src={imagen}
                alt="archivo"
                style={{
                  width: "250px",
                  height: "250px",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setImagen(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CargarArchivos;
