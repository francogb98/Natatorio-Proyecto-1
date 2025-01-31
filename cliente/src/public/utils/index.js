export const fechaHandler = (fechaCargaCertificadoHongos) => {
  const [day, month, year] = fechaCargaCertificadoHongos.split("/").map(Number);
  const fechaInicial = new Date(year, month - 1, day);

  // Calcular la fecha un mes después
  const fechaUnMesDespues = new Date(
    fechaInicial.setMonth(fechaInicial.getMonth() + 1)
  );

  // Calcular días faltantes
  const diasFaltantes = Math.ceil(
    (fechaUnMesDespues - new Date()) / (1000 * 60 * 60 * 24)
  );

  // Formatear la fecha de vencimiento
  const fechaVencimiento = fechaUnMesDespues.toLocaleDateString("es-ES");

  return { fechaVencimiento, diasFaltantes };
};
