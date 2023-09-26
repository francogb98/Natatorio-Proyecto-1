import React, { useCallback, useEffect, useState } from "react";

import { useQuery, useMutation } from "react-query";
import { getAllUsers } from "../../../helpers/fetch";

import Swal from "sweetalert2";
import { suspenderUser } from "../../../helpers/suspendUser";
import { getUser } from "../../../helpers/getInfoUser";
import TablaAllUsers from "./TablaAllUsers";

import { changeRol } from "../../../helpers/cambiarRole";
import User from "../UserInfo/User";

import style from "./listaUsuarios.module.css";
import SearchUser from "./SearchUser";

import { set } from "lodash";

function ListaUsuarios() {
  const [users, setUsers] = useState([]);
  const [errorSearch, setErrorSearch] = useState({
    status: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const {
    isLoading,
    error,
    data: firstData,
    refetch,
    isSuccess,
  } = useQuery({
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
    onSuccess: (data) => {
      if (data.status == "error") {
        setTimeout(() => {
          getUserById.reset();
        }, 3000);
      }
    },
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

  if (getUserById.isLoading || getUserById.isSuccess) {
    return <User getUserById={getUserById} />;
  }

  if (isSuccess && users.length === 0) {
    setUsers(firstData.users);
  }

  return (
    <div style={{ width: "92%" }}>
      <div className={style.searchUser}>
        <h1>Lista de usuarios</h1>

        <SearchUser
          setLoading={setLoading}
          setUsers={setUsers}
          setErrorSearch={setErrorSearch}
        />
      </div>
      <div style={{ height: "550px", overflowY: "scroll" }}>
        {loading && (
          <div
            className={`spinner-border text-danger mb-2  ${style.spinner}`}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        {!loading && errorSearch.status && (
          <div className="alert alert-danger" role="alert">
            {errorSearch.message}
          </div>
        )}
        <TablaAllUsers
          data={users}
          editRole={editRole}
          setEditRole={setEditRole}
          suspender={suspender}
          setSuspender={setSuspender}
          handleChange={handleChange}
          getUserById={getUserById}
        />
      </div>
    </div>
  );
}

export default ListaUsuarios;
