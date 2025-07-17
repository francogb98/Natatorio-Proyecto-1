export function contarInasistencias(users, filtered2025) {
  // Paso 1: Extraer todas las fechas de 2025 de filtered2025
  const all2025Dates = filtered2025.flatMap((item) => item.dias);

  // Paso 2: Ordenar las fechas para tener una secuencia cronológica
  all2025Dates.sort((a, b) => {
    const [dayA, monthA, yearA] = a.split("/").map(Number);
    const [dayB, monthB, yearB] = b.split("/").map(Number);
    return (
      new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB)
    );
  });

  // Paso 3: Procesar cada usuario
  const results = users.map((user) => {
    // Asistencias del usuario en 2025 (ordenadas)
    const userAttendances = user.asistencia
      .filter((date) => date.includes("/2025"))
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.split("/").map(Number);
        const [dayB, monthB, yearB] = b.split("/").map(Number);
        return (
          new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB)
        );
      });

    // Encontrar la primera fecha donde coincidan usuario y actividad
    let firstMatchIndex = -1;
    for (let i = 0; i < userAttendances.length; i++) {
      const indexInActivity = all2025Dates.indexOf(userAttendances[i]);
      if (indexInActivity !== -1) {
        firstMatchIndex = indexInActivity;
        break;
      }
    }

    // Si no hay coincidencias
    if (firstMatchIndex === -1) {
      return {
        user: `${user.nombre} ${user.apellido}`,
        firstDate: null,
        asistencias: 0,
        inasistencias: all2025Dates.length,
        fechasInasistencias: [...all2025Dates], // Todas las fechas son inasistencias
      };
    }

    // Fechas relevantes (actividad desde la primera coincidencia)
    const relevantActivityDates = all2025Dates.slice(firstMatchIndex);
    const firstDate = all2025Dates[firstMatchIndex];

    // Asistencias del usuario que coinciden con las fechas de actividad (desde firstMatchIndex)
    const userRelevantAttendances = userAttendances.filter((date) =>
      relevantActivityDates.includes(date)
    );

    // Calcular inasistencias (fechas donde NO estuvo)
    const fechasInasistencias = relevantActivityDates.filter(
      (date) => !userAttendances.includes(date)
    );

    return {
      user: `${user.nombre} ${user.apellido}`,
      firstDate,
      inasistencias: fechasInasistencias.length,
      fechasInasistencias, // Array con las fechas faltantes
    };
  });

  return results;
}
