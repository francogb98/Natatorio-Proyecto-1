function Piletas({ pileta, users }) {
  return (
    <table className="table table-stripped">
      <thead>
        <tr>
          <th>Id</th>
          <th>Nombre</th>
          <th>Actividad</th>
          <th>Salida</th>
        </tr>
      </thead>
      <tbody>
        {!users.length ? (
          <tr>
            <td colSpan="4">No hay usuarios</td>
          </tr>
        ) : (
          users.map((user, i) => (
            <tr key={i}>
              <td>{user.customId}</td>
              <td>{user.nombre}</td>
              <td>{user.activity[0]?.name}</td>
              <td>{user.activity[0]?.hourFinish}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default Piletas;
