function Piletas({ pileta, users, horaActual }) {
  return (
    <table className="table table-stripped">
      <thead>
        <tr>
          <th>Id</th>
          <th>Nombre</th>

          <th>Ingreso</th>
          <th>Salida</th>
        </tr>
      </thead>
      <tbody>
        {!users.length ? (
          <tr>
            <td colSpan="5">No hay usuarios</td>
          </tr>
        ) : (
          users.map((user, i) => {
            return (
              <tr key={i}>
                <td>{user.customId}</td>
                <td
                  style={
                    pileta !== "turnoSiguiente"
                      ? horaActual > user.activity[0]?.hourStart
                        ? { color: "black" }
                        : { color: "red" }
                      : null
                  }
                >
                  {user.nombre} {user.apellido}
                </td>

                <td>{user.activity[0]?.hourStart}</td>
                <td>{user.activity[0]?.hourFinish}</td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

export default Piletas;
