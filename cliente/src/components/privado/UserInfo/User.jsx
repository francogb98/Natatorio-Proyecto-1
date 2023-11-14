import React, { useEffect, useState } from "react";

import avatar from "../../../helpers/avatar.webp";

import { useLocation, useParams } from "react-router-dom";

import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUser } from "../../../helpers/usersFetch/getInfoUser";

import style from "./style.module.css";
import { inhabilitarUsuario } from "../../../helpers/usersFetch/inhabilitarUsuario";
import { HabilitarUsuario } from "../../../helpers/usersFetch/HabilitarUsuario";
import { changeRol } from "../../../helpers/usersFetch/cambiarRole";

function User() {
  //accedo al id que viene por parametro

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({});

  const [image, setImage] = useState(null);

  const [estado, setEstado] = useState({
    status: false,
    type: "",
  });

  const { id } = useParams();

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["getUserData"],
    queryFn: () => getUser(id),
  });

  const queryClient = useQueryClient();

  const inhabilitar = useMutation({
    mutationFn: inhabilitarUsuario,
    onSuccess: (data) => {
      setLoading(false);

      if (data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Usuario inhabilitado",
          showConfirmButton: false,
          timer: 1500,
        });

        queryClient.invalidateQueries("getUserData");
        queryClient.invalidateQueries("usuarios");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo salio mal",
        });
      }
    },
    onError: (error) => {},
  });

  const habilitar = useMutation({
    mutationFn: HabilitarUsuario,
    onSuccess: (data) => {
      setLoading(false);
      if (data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Usuario habilitado",
          showConfirmButton: false,
          timer: 1500,
        });

        queryClient.invalidateQueries("getUserData");
        queryClient.invalidateQueries("usuarios");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo salio mal",
        });
      }
    },
    onError: (error) => {},
  });

  const cambiar = useMutation({
    mutationFn: changeRol,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Rol cambiado",
          showConfirmButton: false,
          timer: 1000,
        });

        queryClient.invalidateQueries("getUserData");
        queryClient.invalidateQueries("usuarios");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo salio mal",
        });
      }
    },
  });
  // queryClient.invalidateQueries("getUserData");

  useEffect(() => {}, [mensaje]);
  useEffect(() => {}, [estado]);
  useEffect(() => {}, [image]);

  useEffect(() => {
    // Desplaza la ventana hacia la parte superior cuando el componente se monta
    return () => {
      queryClient.removeQueries("getUserData");
    };
  }, []);
  //quiero que cuando se cierreel componente se borre la informacion de la data

  useEffect(() => {
    if (isSuccess) {
      setUser(data.user);
    }
  }, [data, isSuccess]);

  if (isLoading) {
    return (
      //cargame una vista parcial
      <div className={style.loading}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (data) {
    return (
      <>
        <div className={style.body}>
          {estado.status && (
            <div className={style.alert}>
              <h4>
                ¿Seguro que deseas {estado.type} al usuario: {user.nombre}{" "}
                {user.apellido}?
              </h4>
              <div className={style.buttonGroup}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (estado.type === "inhabilitar") {
                      setLoading(true);

                      inhabilitar.mutate({
                        id: user._id,
                        mensaje: mensaje,
                        idActivity: user.activity[0]._id,
                      });
                      setEstado({
                        status: false,
                        type: "",
                      });
                    } else {
                      setLoading(true);
                      habilitar.mutate({
                        id: user._id,
                      });
                      setEstado({
                        status: false,
                        type: "",
                      });
                    }
                  }}
                >
                  Si
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    setEstado({
                      status: false,
                      type: "",
                    })
                  }
                >
                  No
                </button>
              </div>
            </div>
          )}
          <header className={style.header}>
            <img src={user.foto} alt="" />
            <h1>
              {user.nombre} {user.apellido}
            </h1>
            <h4>
              Id usuario: <span>{user.customId}</span>
            </h4>
            {user.natacionAdaptada && <h4>Usuario de natacion adaptada</h4>}
          </header>
          {loading && (
            <div className={style.loading}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <main className={style.main}>
            <section className={`card ${style.datos}`}>
              <div className="card-body">
                <h5 className="card-title">Datos personales</h5>
                <p className="card-text">
                  DNI: <span>{user.dni}</span>
                </p>
                <p className="card-text">
                  Edad: <span>{user.edad}</span>
                </p>

                <p className="card-text">
                  Telefono: <span>{user.telefono}</span>
                </p>
                <p className="card-text">
                  Telefono Contacto: <span>{user.telefonoContacto}</span>
                </p>
                <p className="card-text">
                  Email: <span>{user.email}</span>
                </p>
                <div className="card-text">
                  Ciudad: <span>{user.ciudad}</span>
                </div>
                {user.barrio && (
                  <p className="card-text">
                    Barrio: <span>{user.barrio}</span>
                  </p>
                )}

                {user.activity && (
                  <p className="card-text" style={{ maxWidth: "200px" }}>
                    Estado:{" "}
                    <span className="text-success">
                      {!user.activity.length
                        ? "No Inscripto en nignua actividad"
                        : !user.status
                        ? "Esperando habilitacion"
                        : "Aprobado"}
                    </span>
                  </p>
                )}
                {user.mensaje && (
                  <p className="card-text" style={{ maxWidth: "200px" }}>
                    Mensaje: <span className="text-danger">{user.mensaje}</span>
                  </p>
                )}

                <div style={{ maxWidth: "200px" }}>
                  <p className="card-text">
                    Rol: <span className="text-danger">{user.role}</span>
                  </p>
                  <label htmlFor="" style={{ maxWidth: "150px" }}>
                    Cambiar Rol:
                  </label>
                  <select
                    name=""
                    id=""
                    style={{ maxWidth: "150px" }}
                    onChange={(e) => {
                      cambiar.mutate({
                        id: user._id,
                        role: e.target.value,
                      });
                    }}
                    defaultValue={user.role}
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="COORDINADOR_ADAPTADA">
                      COORDINADOR_ADAPTADA
                    </option>
                    <option value="COORDINADOR_PROFESOR">
                      COORDINADOR_PROFESOR
                    </option>
                    <option value="ADMINISTRATIVO">ADMINISTRATIVO</option>
                    <option value="GUARDAVIDA">GUARDAVIDA</option>
                    <option value="PROFESOR">PROFESOR</option>
                    <option value="usuario">usuario</option>
                  </select>
                </div>
              </div>
            </section>
            {user.activity && (
              <section className={`card ${style.activity}`}>
                <div className="card-body">
                  <h5 className="card-title">Actividad</h5>
                  <h6 className="card-subtitle mb-2 text-body-secondary">
                    {user.activity[0]?.name}
                  </h6>
                  <p className="card-text">
                    Horario:{" "}
                    <span>
                      {user.activity[0]?.hourStart} -{" "}
                      {user.activity[0]?.hourFinish}
                    </span>
                  </p>
                  <p className="card-text">
                    Dias: <span>{user.activity[0]?.date.join(" - ")}</span>
                  </p>
                </div>
              </section>
            )}
            <section className={`card ${style.archivos}`}>
              <div className="card-body">
                <h5 className="card-title">Archivos</h5>

                <p className="card-text">
                  Ficha Medica:{" "}
                  <span
                    className={style.span}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => {
                      setImage(user.fichaMedica);
                    }}
                  >
                    Ver ficha
                  </span>
                </p>
                <p className="card-text">
                  Certificado de Hongos:{" "}
                  <span
                    className={style.span}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => {
                      setImage(user.certificadoHongos);
                    }}
                  >
                    Ver certificado
                  </span>
                </p>
                <p className="card-text">
                  Fecha de carga certificado:{" "}
                  <span>{user.fechaCargaCertificadoHongos}</span>
                </p>
                {user.natacionAdaptada && (
                  <>
                    <p className="card-text">
                      CUD:{" "}
                      <span
                        className={style.span}
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() => {
                          setImage(user.cud);
                        }}
                      >
                        Ver cud
                      </span>
                    </p>
                    <p className="card-text">
                      Diagnostico: <span className={style.span}>Ver cud</span>
                    </p>
                  </>
                )}
              </div>
            </section>

            <section className={`card ${style.formulario}`}>
              <div className="card-body">
                <h5 className="card-title">Formulario</h5>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                      Mensaje para el usuario
                    </label>
                    <textarea
                      type="email"
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      onChange={(e) => setMensaje(e.target.value)}
                    />
                    <div id="emailHelp" className="form-text">
                      Solo en caso de que no se pueda habilitar
                    </div>
                  </div>
                  <div className={style.buttonGroup}>
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        setEstado({
                          status: true,
                          type: "habilitar",
                        })
                      }
                    >
                      Habilitar
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={() =>
                        setEstado({
                          status: true,
                          type: "inhabilitar",
                        })
                      }
                      disabled={!mensaje}
                    >
                      Inhabilitar
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </main>
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
                <img src={image} alt="" />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    setImage(null);
                  }}
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
}

export default User;
