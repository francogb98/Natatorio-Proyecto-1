export function calcularDiasDesde(fechaCarga) {
  console.log(fechaCarga);

  // Dividir la fecha en día, mes y año
  const [dia, mes, anio] = fechaCarga.split("/").map(Number);

  // Crear fecha de carga (mes es 0-11 en JavaScript)
  const fechaInicial = new Date(anio, mes - 1, dia);

  // Calcular fecha de expiración (1 mes después)
  const fechaExpiracion = new Date(fechaInicial);
  fechaExpiracion.setMonth(fechaExpiracion.getMonth() + 1);

  // Fecha actual
  const fechaActual = new Date();

  // Si la fecha actual es anterior a la de expiración, retornar 0
  if (fechaActual < fechaExpiracion) {
    return 0;
  }

  // Calcular diferencia en días
  const diferenciaMs = fechaActual - fechaExpiracion;
  const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

  return diferenciaDias;
}
