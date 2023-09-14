import React, { useEffect, useState } from "react";

import { useQuery, useMutation } from "react-query";
import { getAllUsers } from "../../../helpers/fetch";

import Swal from "sweetalert2";
import { suspenderUser } from "../../../helpers/suspendUser";
import { getUser } from "../../../helpers/getInfoUser";
import TablaAllUsers from "./TablaAllUsers";

import { changeRol } from "../../../helpers/cambiarRole";

function ListaUsuarios() {
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["listaUsuarios"],
    queryFn: getAllUsers,
  });

  const suspendUser = useMutation({
    mutationKey: ["listaUsuarios"],
    mutationFn: suspenderUser,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          title: data.message,
          icon: data.status,
          confirmButtonText: "Aceptar",
        });
        setSuspender({
          id: "",
          status: false,
        });
        refetch();
      } else {
        Swal.fire({
          title: data.message,
          icon: data.status,
          confirmButtonText: "Aceptar",
        });
      }
    },
  });

  const cambiarRole = useMutation({
    mutationKey: ["listaUsuarios"],
    mutationFn: changeRol,
    onSuccess: (data) => {
      if (data.status === "success") {
        Swal.fire({
          title: data.message,
          icon: data.status,
          confirmButtonText: "Aceptar",
        });
        setEditRole({
          id: "",
          status: false,
        });
        refetch();
      } else {
        Swal.fire({
          title: data.message,
          icon: data.status,
          confirmButtonText: "Aceptar",
        });
      }
    },
  });

  const getUserById = useMutation({
    mutationFn: getUser,
  });

  const [editRole, setEditRole] = useState({
    id: "",
    status: false,
    role: "",
  });
  const [suspender, setSuspender] = useState({
    id: "",
    status: false,
  });

  const cambiarRol = (id) => {};

  if (isLoading) return <h1>Cargando...</h1>;

  if (error) return <h1>Error...</h1>;

  //   useEffect(() => {
  //     console.log(suspender);
  //   }, [suspender]);

  const handleChange = (user) => {
    if (editRole.status) {
      cambiarRole.mutate({
        content: {
          id: user._id,
          role: editRole.role,
        },
      });
    }
    if (suspender.status) {
      suspendUser.mutate({
        content: {
          id: user._id,
          idActivity: user.activity[0]._id,
        },
      });
    }
  };

  return (
    <div style={{ width: "92%" }}>
      <h1>Lista de usuarios</h1>
      <div style={{ height: "550px", overflowY: "scroll" }}>
        <TablaAllUsers
          data={data}
          editRole={editRole}
          setEditRole={setEditRole}
          suspender={suspender}
          setSuspender={setSuspender}
          getUserById={getUserById}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
}

export default ListaUsuarios;
