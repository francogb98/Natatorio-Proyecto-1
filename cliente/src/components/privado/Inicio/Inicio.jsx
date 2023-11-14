import React, { useContext, useEffect, useRef, useState } from "react";

import { useSocket } from "../../../hooks/useSocket";
import { AuthContext } from "../../../context/AuthContext";

import { baseUrl } from "../../../helpers/url";

import LayoutPiletas from "./piletas/LayoutPiletas";

import LayoutForm from "./formulario/LayoutForm";
import getUsersFromActivity from "../../../helpers/activitiesFetch/getUsersFromActivity";
import { useQuery } from "react-query";

import style from "./inicio.module.css";

function Inicio() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const getUsers = useQuery("getUsers", getUsersFromActivity);

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (getUsers.data) {
      setUserList(getUsers.data.userList);
    }
  }, [getUsers.data]);

  //CONEXION AL SOCKET
  const { socket, online, conectarSocket, desconectarSocket } =
    useSocket(baseUrl);
  const { auth } = useContext(AuthContext);
  useEffect(() => {
    if (auth.logged) {
      conectarSocket();
    }
  }, [auth, conectarSocket]);

  useEffect(() => {
    setTimeout(() => {
      setSuccess(false);
    }, 1000);
  }, [success]);

  useEffect(() => {
    console.log(error);
    setTimeout(() => {
      setError(false);
    }, 2000);
  }, [error]);

  return (
    <section>
      <div className={style.alert}>
        {cargando && (
          <div className="alert alert-warning">
            <h4 className="alert-heading">Cargando...</h4>
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <h4 className="alert-heading">Usuario agregado</h4>
          </div>
        )}
        {error && (
          <div className="alert alert-danger">
            <h4 className="alert-heading">Error!</h4>
            <p>{error.msg}</p>
          </div>
        )}
      </div>
      <header>
        <LayoutForm
          socket={socket}
          setCargando={setCargando}
          userList={userList}
        />
      </header>

      <main>
        <LayoutPiletas
          socket={socket}
          setCargando={setCargando}
          setError={setError}
          setSuccess={setSuccess}
        />
      </main>
    </section>
  );
}

//traigo el dia, la hora, las piletas
//   const { horaActual, diaActualEnEspanol, data, refetch, isRefetching } =
//     useDiaYHoraActual();

//   // -----------------Estados-----------------
//   const [error, setError] = useState({
//     error: false,
//     msg: "",
//     nombre: "",
//   });
//   const [success, setSuccess] = useState({
//     success: false,
//     msg: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [cambiandoTurno, setCambiandoTurno] = useState({
//     status: false,
//     msg: "",
//   });

//   //obtengo todas las actividades del dia que esten en este horario
//   //obtengo todas las piletas en este horario
//   useEffect(() => {}, [horaActual, diaActualEnEspanol]);

//   // -----------------Socket-----------------
//   const { socket, online, conectarSocket, desconectarSocket } =
//     useSocket(baseUrl);
//   const { auth } = useContext(AuthContext);
//   useEffect(() => {
//     if (auth.logged) {
//       conectarSocket();
//     }
//   }, [auth, conectarSocket]);

//   // ----------------------Escuchar eventos del socket----------------------

//   // -----------------Registrar Uusario Turno Actual-----------------

//   // -----------------Registrar Uusario Turno Siguiente-----------------

//   //-----------------------Finalizar turno y Cambiar de horario -----------------------
//   const handleEnd = () => {
//     console.log("me ejecute a las", horaActual + ":00");
//     setCambiandoTurno({
//       status: true,
//       msg: "Cargando turno por favor espere...",
//     });
//     socket?.emit("cambiar-turno", {
//       horaActual: horaActual + ":00",
//     });
//   };

//   //-----------se ejecutara cuando se cambie la hora, solo si la hora es distinta------

//   const [horaAnterior, setHoraAnterior] = useState(horaActual);

//   useEffect(() => {
//     if (horaActual !== horaAnterior) {
//       console.log("cambio la hora");
//       handleEnd();
//     }
//     setHoraAnterior(horaActual);
//   }, [horaActual]);

//   // -----------------Actualizar data de tabla y loading-----------------

//   useEffect(() => {
//     if (loading && !isRefetching) {
//       setLoading(isRefetching);
//     }
//     if (success.success && !isRefetching) {
//       setTimeout(() => {
//         setSuccess({ success: false, msg: "" });
//       }, 1000);
//     }
//     if (cambiandoTurno && !isRefetching) {
//       setCambiandoTurno({ status: false, msg: "" });
//     }
//   }, [isRefetching]);

//   return (
//     <div className={style.body}>
//       {cambiandoTurno.status ? (
//         <h1 className={"text-danger"}>{cambiandoTurno.msg}</h1>
//       ) : (
//         // <h1 className="text-danger">Cambiando turno por favor espere...</h1>
//         <>
//           <header className={style.header}>
//             <section>
//               <h4>{diaActualEnEspanol}</h4>
//               {/* <button onClick={handleEnd}>cambiarTurno</button> */}
//               <h4>
//                 Turno Actual {parseFloat(horaActual)}:00 -{" "}
//                 {parseFloat(horaActual) + 1}:00
//               </h4>

//               {loading && <h1>Cargando...</h1>}
//               {!loading && error.error && (
//                 <h3
//                   className="alert alert-danger"
//                   role="alert"
//                   style={{
//                     position: "absolute",
//                     bottom: "0",
//                     right: "0",
//                     marginRight: "20px",
//                     width: "fit-content",
//                     textAlign: "center",
//                   }}
//                 >
//                   {error.msg}
//                 </h3>
//               )}
//               {!loading && success.success && (
//                 <h4
//                   className="alert alert-success "
//                   role="alert"
//                   style={{
//                     position: "absolute",
//                     bottom: "0",
//                     right: "0",
//                     marginRight: "20px",
//                     width: "fit-content",
//                     textAlign: "center",
//                   }}
//                 >
//                   {success.msg}
//                 </h4>
//               )}
//             </section>

//             <FormularioPrueba registrarUsuario={registrarUsuario} />
//             <FormularioTurnoSiguiente
//               registrarUsuarioTurnoSiguiente={registrarUsuarioTurnoSiguiente}
//             />
//           </header>

//           <main className={style.main}>
//             {data?.piletas.map((pileta, i) => {
//               // creo un componenete que se llame piletas al cual le voy a pasar, nombre de pileta y usuarios
//               return (
//                 <div style={{ minWidth: "450px" }}>
//                   <div>
//                     <h3>{pileta.pileta}</h3>
//                     <button
//                       onClick={() => {
//                         reinicarPileta(pileta.pileta);
//                       }}
//                     >
//                       reiniciar
//                     </button>
//                   </div>
//                   <Piletas
//                     key={i}
//                     pileta={pileta.pileta}
//                     users={pileta.users}
//                     refetch={refetch}
//                   />
//                 </div>
//               );
//             })}
//           </main>
//         </>
//       )}
//     </div>
//   );
// }
export default Inicio;
