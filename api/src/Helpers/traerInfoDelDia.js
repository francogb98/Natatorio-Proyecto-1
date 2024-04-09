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
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Obtener el nombre del día y el mes
  const mesNombre = meses[today.getMonth()];

  let date = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
  });

  date = date.charAt(0).toUpperCase() + date.slice(1);

  if (date === "Miércoles") {
    date = "Miercoles";
  }

  return { hora, fecha, horaAnterior, horaActual, mesNombre, date };
}
