export function obtenerFechaYHoraArgentina() {
  let dated = new Date();
  let argentinaTime = dated.toLocaleString("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
  });

  let horaActual = new Date(argentinaTime).getHours();
  let hora = horaActual;
  let horaAnterior = hora - 1;
  if (hora.toString().length === 1) {
    hora = `0${hora}:00`;
  } else {
    hora = `${hora}:00`;
  }

  if (horaAnterior.toString().length === 1) {
    horaAnterior = `0${horaAnterior}:00`;
  } else {
    horaAnterior = `${horaAnterior}:00`;
  }

  let today = new Date();
  today.setUTCHours(today.getUTCHours() - 3); // Ajuste para la zona horaria de Argentina (UTC-3)

  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); // Enero es 0!
  let yyyy = today.getFullYear();

  const fecha = `${dd}/${mm}/${yyyy}`;

  return { hora, fecha, horaAnterior, horaActual };
}
