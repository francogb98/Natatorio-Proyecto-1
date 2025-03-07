import PopoverButton from "../../utils/Popover";
import { User } from "../../../models";
import React from "react";

interface TablaPiletaProps {
  users: User[];
}

function TablaPileta({ users }: TablaPiletaProps) {
  //filtra cada 10 usuarios

  const usersLength = users.filter((user, index) => {
    return index < 10;
  });

  return (
    <table className="table table-striped table-hover table-bordered table-responsive">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Nombre</th>
          <th scope="col">Actividad</th>
          <th scope="col">Salida</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user: User) => (
          <tr key={user._id} style={{ cursor: "pointer" }}>
            <th scope="row">{user.customId}</th>
            <td>
              <PopoverButton user={user} />
            </td>
            <td>{user.activity[0].name}</td>
            <td>{user.activity[0].hourFinish}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TablaPileta;
