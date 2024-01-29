import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUser } from "../../../../helpers/usersFetch/getInfoUser";

import style from "./style.module.css";

import { changeRol } from "../../../../helpers/usersFetch/cambiarRole";
import FormularioHabilitarUsuario from "./FormularioHabilitarUsuario";
import Notificaciones from "./Notificaciones";

import avatar from "../../../../assets/avatar.webp";
import { getInfoUser } from "../../../../helpers/fetch";

function User() {
  //accedo al id que viene por parametro

  const getUserData2 = useQuery({
    queryKey: ["getUser"],
    queryFn: getInfoUser,
    staleTime: 0,
    onSuccess: (data) => {
      if (data.status === "success") {
        return data;
      }
    },
  });

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

  useEffect(() => {}, [estado]);
  useEffect(() => {}, [image]);

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
          <header className={style.header}>
            <img src={user.foto ? user.foto : avatar} alt="foto-perfil" />
            <h1>
              {user.nombre} {user.apellido}
            </h1>
            <h4>
              Id usuario: <span>{user.customId}</span>
            </h4>
            {user.natacionAdaptada && (
              <h4 className="text-danger">Usuario de natacion adaptada</h4>
            )}
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
                  Telefono Emergencia: <span>{user.telefonoContacto}</span>
                </p>

                <div style={{ maxWidth: "200px", marginBottom: "20px" }}>
                  <p className="card-text">
                    Rol: <span className="text-danger">{user.role}</span>
                  </p>
                  {getUserData2.data.user.role === "SUPER_ADMIN" && (
                    <>
                      <label htmlFor="" style={{ maxWidth: "150px" }}>
                        Cambiar Rol:
                      </label>
                      <select
                        name=""
                        id=""
                        style={{ maxWidth: "100%" }}
                        onChange={(e) => {
                          cambiar.mutate({
                            id: user._id,
                            role: e.target.value,
                          });
                        }}
                        defaultValue={user.role}
                      >
                        <option value="SUPER_ADMIN">--Seleccionar Rol--</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="ADMINISTRATIVO">ADMINISTRATIVO</option>
                        <option value="GUARDAVIDA">GUARDAVIDA</option>
                        <option value="PROFESOR">PROFESOR</option>
                        <option value="usuario">usuario</option>
                      </select>
                    </>
                  )}
                </div>

                <p className="card-text">
                  Ciudad: <span>{user.ciudad}</span>
                </p>
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
              </div>
            </section>

            {user.activity && (
              <section className={`card ${style.activity}`}>
                <div className="card-body">
                  <h5 className="card-title">Actividad</h5>
                  <>
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
                  </>
                </div>
              </section>
            )}

            <section className={`card ${style.archivos}`}>
              <div className="card-body">
                <h5 className="card-title">Archivos</h5>

                <p className="card-text">
                  Foto Documento:{" "}
                  {user.fotoDocumento ? (
                    <span
                      className={style.span}
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => {
                        setImage(user.fotoDocumento);
                      }}
                    >
                      Ver documento
                    </span>
                  ) : (
                    <span style={{ color: "red" }}>No cargado</span>
                  )}
                </p>
                <p className="card-text">
                  Ficha Medica:{" "}
                  {user.fichaMedica ? (
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
                  ) : (
                    <span style={{ color: "red" }}>No cargada</span>
                  )}
                </p>
                <p className="card-text">
                  Certificado de Hongos:{" "}
                  {!user.certificadoHongos ? (
                    <span style={{ color: "red" }}>No cargado</span>
                  ) : (
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
                  )}
                </p>
                {user.fechaCargaCertificadoHongos && (
                  <p className="card-text">
                    Fecha de carga certificado:{" "}
                    <span className="text-danger">
                      {user.fechaCargaCertificadoHongos}
                    </span>
                  </p>
                )}
                {user.natacionAdaptada && (
                  <>
                    <p className="card-text">
                      CUD:{" "}
                      {user.cud === "" ? (
                        <span className={style.span}>No cargado</span>
                      ) : (
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
                      )}
                    </p>
                    <p className="card-text">
                      Diagnostico:{" "}
                      <span className="text-danger">{user.diagnosticos}</span>
                    </p>
                  </>
                )}
              </div>
            </section>

            <section className={`card ${style.notificacion}`}>
              <Notificaciones user={user} />
            </section>

            {getUserData2.data.user.role === "SUPER_ADMIN" && (
              <>
                {user.activity && user.activity.length ? (
                  <section className={`card ${style.formulario}`}>
                    <div className="card-body">
                      <h5 className="card-title">
                        Enviar Notificacion al usuario
                      </h5>
                      <FormularioHabilitarUsuario id={user._id} />
                    </div>
                  </section>
                ) : null}
              </>
            )}
          </main>
        </div>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
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
                  src={image}
                  alt="foto"
                  style={{
                    width: "400px",
                    height: "400px",
                    display: "block",
                    margin: "auto",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default User;
