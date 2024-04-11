export function obtenerFechaYHoraArgentina() {
  const ahora = new Date();
  const argentinaTime = new Date(
    ahora.toLocaleString("en-US", {
      timeZone: "America/Argentina/Buenos_Aires",
    })
  );
  const hora = argentinaTime.getHours().toString().padStart(2, "0") + ":00";
  const horaAnterior =
    (argentinaTime.getHours() - 1).toString().padStart(2, "0") + ":00";

  // Formato personalizado de fecha: dd/mm/yyyy
  const fecha = `${String(argentinaTime.getDate()).padStart(2, "0")}/${String(
    argentinaTime.getMonth() + 1
  ).padStart(2, "0")}/${argentinaTime.getFullYear()}`;

  let diaNombre = argentinaTime
    .toLocaleDateString("es-AR", { weekday: "long" })
    .replace("miércoles", "miercoles");

  diaNombre = diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1);

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
  const mesNombre = meses[argentinaTime.getMonth()];

  return { hora, fecha, horaAnterior, mesNombre, diaNombre };
}
