import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { Toaster, toast } from "sonner";
import { UserFetchPrivado } from "../../../../helpers/UserFetchConClases/FETCH-privado/UserFetch-Privado";
import Funciones_administrador from "../hooks/Funciones_administrador";
import Acciones_administrador from "./Acciones_administrador";
import Acciones_mesa_entrada from "./Acciones_mesa_entrada";
import ImagenPerfil from "./ImagenPerfil";
import AnalizarFichaMedica from "./AnalizarFichaMedica";
import avatar from "../../../../assets/avatar.webp";

function UserPerfil() {
  const { auth } = useContext(AuthContext);
  const { id } = useParams();
  const [imagen, setImagen] = useState(null);
  const [view, setView] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState("Ficha Médica");
  const [estado, setEstado] = useState("informacion");
  const [activeTab, setActiveTab] = useState("informacion");

  const { eliminarNotificacion, inhabilitar, habilitar } =
    Funciones_administrador();

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["getUserData", id],
    queryFn: () => UserFetchPrivado.getUser(id),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setArchivo(null);
    refetch();
  }, [id]);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <h3>Cargando...</h3>
      </div>
    );
  }

  if (!data || data.status !== "success") {
    return (
      <div className="alert alert-danger text-center">
        No se pudo cargar la información del usuario.
      </div>
    );
  }

  const user = data.users[0];
  if (archivo === null) {
    setArchivo(user.fichaMedica);
  }

  const handleTabChange = (tab) => {
    setEstado(tab);
    setActiveTab(tab);
  };

  return (
    <div className="container py-4">
      <Toaster richColors position="top-center" />

      {/* Header del perfil */}
      <div className="profile-header text-center mb-4">
        <div className="position-relative d-inline-block">
          <ImagenPerfil
            foto={user.foto ? user.foto : avatar}
            className="profile-avatar shadow"
          />
          {user.status && (
            <span className="position-absolute bottom-0 end-0 bg-success rounded-circle p-1 border border-2 border-white"></span>
          )}
        </div>

        <div className="mt-3">
          <h2 className="mb-1">
            {user.nombre.charAt(0).toUpperCase() + user.nombre.slice(1)}{" "}
            {user.apellido.charAt(0).toUpperCase() + user.apellido.slice(1)}
          </h2>
          <div className="d-flex justify-content-center align-items-center gap-2">
            <span className="badge bg-primary">{user.customId}</span>
            <span
              className={`badge ${user.status ? "bg-success" : "bg-warning"}`}
            >
              {user.status ? "Activo" : "Pendiente"}
            </span>
          </div>
        </div>
      </div>

      {/* Pestañas de navegación */}
      <nav className="mb-4">
        <ul className="nav nav-pills nav-fill gap-2 p-1 small bg-light rounded-5 shadow-sm">
          {[
            { id: "informacion", label: "Información", icon: "bi-info-circle" },
            { id: "archivos", label: "Archivos", icon: "bi-folder" },
            { id: "acciones", label: "Acciones", icon: "bi-gear" },
            { id: "notificaciones", label: "Notificaciones", icon: "bi-bell" },
          ].map((tab) => (
            <li className="nav-item" key={tab.id}>
              <button
                className={`nav-link rounded-5 d-flex align-items-center justify-content-center gap-1 ${
                  activeTab === tab.id ? "active bg-primary" : ""
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                <i className={`bi ${tab.icon}`}></i>
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Contenido de las pestañas */}
      <div className="tab-content">
        {/* Información del usuario */}
        {estado === "informacion" && (
          <div className="row g-4">
            {/* Actividades */}
            {user.activity?.length > 0 && (
              <div className="col-lg-6">
                <h3 className="h5 mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-calendar2-event text-primary"></i>
                  Actividades
                </h3>

                {user.activity.map((activity) => (
                  <div
                    key={activity._id}
                    className="card mb-3 shadow-sm border-0"
                  >
                    <div className="card-header bg-primary bg-opacity-10 border-0 d-flex justify-content-between align-items-center">
                      <h4 className="h6 mb-0 text-primary">
                        <i className="bi bi-calendar-event me-2"></i>
                        {activity.name.charAt(0).toUpperCase() +
                          activity.name.slice(1)}
                      </h4>
                      {user.status && auth.role === "SUPER_ADMIN" && (
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() =>
                              inhabilitar.mutate({
                                activityId: activity._id,
                                id: user._id,
                              })
                            }
                            title="Inhabilitar"
                          >
                            <i className="bi bi-slash-circle"></i>
                          </button>
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => habilitar.mutate({ id: user._id })}
                            title="Habilitar"
                          >
                            <i className="bi bi-check-circle"></i>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="card-body">
                      <div className="d-flex flex-column gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-primary bg-opacity-10 p-2 rounded-3">
                            <i className="bi bi-calendar-week text-primary"></i>
                          </div>
                          <div>
                            <small className="text-muted">Días:</small>
                            <p className="mb-0 fw-bold">
                              {activity.date.join(" - ")}
                            </p>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-primary bg-opacity-10 p-2 rounded-3">
                            <i className="bi bi-clock text-primary"></i>
                          </div>
                          <div>
                            <small className="text-muted">Horario:</small>
                            <p className="mb-0 fw-bold">
                              {activity.hourStart} - {activity.hourFinish}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Datos del usuario */}
            <div className={`${user.activity?.length ? "col-lg-6" : "col-12"}`}>
              <div className="card shadow-sm border-0">
                <div className="card-header bg-primary bg-opacity-10 border-0">
                  <h3 className="h5 mb-0 d-flex align-items-center gap-2">
                    <i className="bi bi-person-badge text-primary"></i>
                    Datos del Usuario
                  </h3>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {[
                      {
                        icon: "bi-water",
                        label: "Natación Adaptada",
                        value: user.natacionAdaptada ? "Sí" : "No",
                        badge: user.natacionAdaptada
                          ? "bg-success"
                          : "bg-secondary",
                      },
                      { icon: "bi-person", label: "Edad", value: user.edad },
                      { icon: "bi-card-text", label: "DNI", value: user.dni },
                      {
                        icon: "bi-telephone",
                        label: "Teléfono",
                        value: user.telefono,
                      },
                      {
                        icon: "bi-telephone-plus",
                        label: "Teléfono de Emergencia",
                        value: user.telefonoContacto,
                      },
                      {
                        icon: "bi-shield",
                        label: "Rol",
                        value: user.role,
                        badge: "bg-info",
                      },
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="list-group-item border-0 d-flex justify-content-between align-items-center py-3"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-primary bg-opacity-10 p-2 rounded-3">
                            <i className={`bi ${item.icon} text-primary`}></i>
                          </div>
                          <span>{item.label}</span>
                        </div>
                        {item.badge ? (
                          <span className={`badge ${item.badge}`}>
                            {item.value}
                          </span>
                        ) : (
                          <span className="fw-bold">{item.value}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notificaciones */}
        {estado === "notificaciones" && (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary bg-opacity-10 border-0 d-flex justify-content-between align-items-center">
              <h3 className="h5 mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-bell text-primary"></i>
                Notificaciones
              </h3>
              <span className="badge bg-primary rounded-pill">
                {user.notificaciones.length}
              </span>
            </div>

            <div className="card-body p-0">
              {user.notificaciones.length === 0 ? (
                <div className="text-center py-4">
                  <i
                    className="bi bi-inbox text-muted"
                    style={{ fontSize: "3rem" }}
                  ></i>
                  <p className="text-muted mt-2">No hay notificaciones</p>
                </div>
              ) : (
                <div
                  className="list-group list-group-flush"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  {user.notificaciones
                    .slice()
                    .reverse()
                    .map((notificacion) => (
                      <div
                        key={notificacion._id}
                        className={`list-group-item list-group-item-action ${
                          notificacion.leido ? "" : "bg-light"
                        }`}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6
                            className={`mb-0 ${
                              notificacion.leido
                                ? "text-muted"
                                : "text-primary fw-bold"
                            }`}
                          >
                            {notificacion.asunto}
                          </h6>
                          <button
                            className="btn btn-sm btn-link text-danger p-0"
                            onClick={() => {
                              toast.info("Notificación eliminada");
                              eliminarNotificacion.mutate({
                                idNotificacion: notificacion._id,
                                id: user._id,
                              });
                            }}
                            aria-label="Eliminar notificación"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>

                        <p
                          className={`small mb-2 ${
                            notificacion.leido ? "text-muted" : ""
                          }`}
                        >
                          {notificacion.cuerpo}
                        </p>

                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            {notificacion.fecha ?? "Sin fecha"}
                          </small>
                          <span
                            className={`badge ${
                              notificacion.leido ? "bg-success" : "bg-warning"
                            }`}
                          >
                            {notificacion.leido ? "Leído" : "No leído"}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Acciones */}
        {estado === "acciones" && (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary bg-opacity-10 border-0">
              <h3 className="h5 mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-gear text-primary"></i>
                Acciones Disponibles
              </h3>
            </div>
            <div className="card-body">
              {auth.role === "SUPER_ADMIN" && (
                <Acciones_administrador user={user} />
              )}
              {auth.role === "ADMINISTRATIVO" && (
                <Acciones_mesa_entrada user={user} />
              )}
            </div>
          </div>
        )}

        {/* Archivos */}
        {estado === "archivos" && (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary bg-opacity-10 border-0">
              <h3 className="h5 mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-folder text-primary"></i>
                Documentos del Usuario
              </h3>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2 mb-4">
                {[
                  {
                    label: "Ficha Médica",
                    value: user.fichaMedica,
                    color: "primary",
                  },
                  {
                    label: "Certificado PyM",
                    value: user.certificadoHongos,
                    color: "secondary",
                  },
                  { label: "DNI", value: user.fotoDocumento, color: "success" },
                ].map((doc, index) => (
                  <button
                    key={index}
                    className={`btn btn-outline-${doc.color} ${
                      archivo === doc.value ? "active" : ""
                    }`}
                    onClick={() => {
                      setArchivo(doc.value);
                      setNombreArchivo(doc.label);
                    }}
                  >
                    {doc.label}
                  </button>
                ))}
              </div>

              <AnalizarFichaMedica
                imagen={archivo}
                placeholder={nombreArchivo}
                customId={user.customId}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { UserPerfil };
