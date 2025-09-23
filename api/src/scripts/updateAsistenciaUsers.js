import { User } from "../models/User.js"; // Asegúrate de poner la ruta correcta
import mongoose from "mongoose";
import dotenv from "dotenv";
import { obtenerFechaYHoraArgentina } from "../Helpers/traerInfoDelDia.js";
import { Activity } from "../models/Actividades.js";
dotenv.config();

// Conexión a la base de datos
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATA}/?retryWrites=true&w=majority`;

// export const updateAsistenciaForActiveUsers = async () => {
//   try {
//     //  Conectar a la base de datos
//     await mongoose.connect(MONGO_URI);

//     //  Obtener la fecha actual en Argentina
//     const fechaHoy = obtenerFechaYHoraArgentina().fecha;

//     //  Buscar y actualizar todos los usuarios con al menos una actividad
//     const result = await User.updateMany(
//       { activity: { $exists: true, $not: { $size: 0 } } }, // Usuarios con actividades
//       {
//         $addToSet: { asistencia: fechaHoy }, // Añadir fecha de hoy a asistencia
//         $unset: { inasistencias: "" }, //   Eliminar inasistencias si existe
//       }
//     );

//     console.log(`Asistencia actualizada para ${result.modifiedCount} usuarios`);
//     return {
//       status: "success",
//       usersUpdated: result.modifiedCount,
//     };
//   } catch (error) {
//     console.error("Error al actualizar asistencia masiva:", error);
//     return {
//       status: "error",
//       message: error.message,
//     };
//   } finally {
//     // Desconectar de la base de datos
//     await mongoose.disconnect();
//   }
// };

// updateAsistenciaForActiveUsers();

// function esAgosto2025(fechaStr) {
//   if (!fechaStr) return false;
//   const partes = fechaStr.split("/");
//   if (partes.length !== 3) return false;
//   return partes[1] === "08" && partes[2] === "2025";
// }

// async function filterUsersWithAugustNotifications() {
//   try {
//     // Método 1: Usando aggregation pipeline (más eficiente)
//     await mongoose.connect(MONGO_URI);

//     console.log("🔍 Buscando usuarios con notificaciones en agosto 2024...");

//     const users = await User.find({
//       "notificaciones.fecha": {
//         $regex: /\/8\/2025|\/08\/2025/i,
//       },
//     })
//       .select("customId nombre apellido dni telefono ciudad notificaciones")
//       .lean() // Usar lean() para mejor performance
//       .maxTimeMS(30000); // Timeout específico para esta consulta

//     console.log(
//       `📊 Encontrados ${users.length} usuarios con notificaciones en agosto 2024`
//     );

//     const processedUsers = users.map((user, index) => {
//       const augustNotifications = user.notificaciones.filter((notif) =>
//         /\/8\/2025|\/08\/2025/i.test(notif.fecha)
//       );

//       console.log(`\n${index + 1}. ${user.nombre} ${user.apellido}`);
//       console.log(`   ID: ${user.customId} | DNI: ${user.dni}`);
//       console.log(`   Ciudad: ${user.ciudad}`);
//       console.log(`   Teléfono: ${user.telefono || "No especificado"}`);
//       console.log(
//         `   Total notificaciones agosto: ${augustNotifications.length}`
//       );

//       // Mostrar las notificaciones de agosto
//       augustNotifications.forEach((notif, i) => {
//         console.log(
//           `     📧 ${i + 1}. ${notif.asunto} (${notif.fecha}) ${
//             notif.leido ? "✅" : "📬"
//           }`
//         );
//       });
//       console.log("   " + "-".repeat(50));

//       return {
//         ...user,
//         notificacionesAgosto: augustNotifications,
//         totalNotificacionesAgosto: augustNotifications.length,
//       };
//     });
//   } catch (error) {
//     console.error("❌ Error filtrando usuarios:", error);
//     throw error;
//   }
// }

// // Ejecutar
// filterUsersWithAugustNotifications();

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conexión verificada");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

const extractActivityInfo = (notificationBody) => {
  try {
    // Extraer nombre de la actividad
    const activityMatch = notificationBody.match(/actividad:\s*([^,]+)/i);
    const activityName = activityMatch ? activityMatch[1].trim() : null;

    // Extraer horario
    const scheduleMatch = notificationBody.match(
      /horario de:\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/i
    );
    const hourStart = scheduleMatch ? scheduleMatch[1] : null;
    const hourFinish = scheduleMatch ? scheduleMatch[2] : null;

    // Extraer días
    const daysMatch = notificationBody.match(/dias:\s*([^.]+)/i);
    let days = [];
    if (daysMatch) {
      const daysString = daysMatch[1].trim();
      days = daysString.split(/\s*-\s*/).map((day) => day.trim());
    }

    // Extraer rango de edad si está presente
    const ageMatch = activityName?.match(/$$\s*(\d+)\s*-\s*(\d+)\s*años\s*$$/i);
    const desde = ageMatch ? Number.parseInt(ageMatch[1]) : null;
    const hasta = ageMatch ? Number.parseInt(ageMatch[2]) : null;

    return {
      activityName: activityName?.replace(/\s*$$[^)]*$$/, "").trim(), // Remover el rango de edad del nombre
      hourStart,
      hourFinish,
      days,
      desde,
      hasta,
      originalName: activityName,
    };
  } catch (error) {
    console.error("Error extrayendo información de actividad:", error.message);
    return null;
  }
};

const findActivityByCriteria = async (criteria) => {
  try {
    const { activityName, hourStart, hourFinish, days, desde, hasta } =
      criteria;

    // Construir query de búsqueda
    const searchQuery = {
      $and: [],
    };

    // Buscar por nombre (flexible)
    if (activityName) {
      searchQuery.$and.push({
        name: { $regex: activityName.replace(/\s+/g, ".*"), $options: "i" },
      });
    }

    // Buscar por horario
    if (hourStart && hourFinish) {
      searchQuery.$and.push({ hourStart, hourFinish });
    }

    // Buscar por rango de edad si está disponible
    if (desde !== null && hasta !== null) {
      searchQuery.$and.push({ desde, hasta });
    }

    // Buscar por días
    if (days && days.length > 0) {
      searchQuery.$and.push({
        date: { $all: days },
      });
    }

    const activity = await Activity.findOne(searchQuery);

    if (!activity && activityName) {
      // Búsqueda más flexible si no se encuentra
      const flexibleQuery = {
        name: { $regex: activityName.split(" ").join(".*"), $options: "i" },
      };

      if (hourStart && hourFinish) {
        flexibleQuery.hourStart = hourStart;
        flexibleQuery.hourFinish = hourFinish;
      }

      return await Activity.findOne(flexibleQuery);
    }

    return activity;
  } catch (error) {
    console.error("Error buscando actividad:", error.message);
    return null;
  }
};

const isUserInAnyActivity = async (userId) => {
  try {
    const activity = await Activity.findOne({ users: userId });
    return activity !== null;
  } catch (error) {
    console.error("Error verificando actividades del usuario:", error.message);
    return false;
  }
};

const reactivateUsers = async () => {
  try {
    console.log("🔍 Buscando usuarios dados de baja en agosto de 2025...");

    const deactivatedUsers = await User.find({
      "notificaciones.cuerpo": {
        $regex:
          /Usted ha sido dado de baja de la actividad.*Debido a que pasaron más de \d+ días/i,
      },
      "notificaciones.fecha": {
        $regex: /\/8\/2025|\/08\/2025/i,
      },
    }).lean();

    if (!deactivatedUsers || deactivatedUsers.length === 0) {
      console.log(
        "ℹ️ No se encontraron usuarios dados de baja en agosto de 2025 para reactivar"
      );
      return;
    }

    console.log(
      `📊 Encontrados ${deactivatedUsers.length} usuarios dados de baja en agosto de 2025`
    );

    let processedCount = 0;
    let reactivatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < deactivatedUsers.length; i++) {
      const deactivatedUser = deactivatedUsers[i];
      processedCount++;

      console.log(
        `\n--- PROCESANDO USUARIO ${processedCount}/${deactivatedUsers.length} ---`
      );
      console.log(
        `👤 Usuario: ${deactivatedUser.nombre} ${deactivatedUser.apellido} ${
          deactivatedUser.customId || ""
        }`
      );

      try {
        const hasActiveActivity = await isUserInAnyActivity(
          deactivatedUser._id
        );

        if (hasActiveActivity) {
          console.log(
            `⚠️ ${deactivatedUser.nombre} ya está inscrito en una actividad. No se procesará.`
          );
          skippedCount++;
          continue;
        }

        console.log(
          `✅ ${deactivatedUser.nombre} no tiene actividades activas. Procediendo con la reactivación...`
        );

        const deactivationNotification = deactivatedUser.notificaciones
          .filter(
            (notif) =>
              notif.cuerpo.includes(
                "Usted ha sido dado de baja de la actividad"
              ) && /\/8\/2025|\/08\/2025/i.test(notif.fecha)
          )
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];

        if (!deactivationNotification) {
          console.log(
            `⚠️ No se encontró notificación de baja de agosto 2025 para ${deactivatedUser.nombre}`
          );
          skippedCount++;
          continue;
        }

        const activityInfo = extractActivityInfo(
          deactivationNotification.cuerpo
        );

        if (!activityInfo || !activityInfo.activityName) {
          console.log(
            `⚠️ No se pudo extraer información de actividad para ${deactivatedUser.nombre}`
          );
          skippedCount++;
          continue;
        }

        console.log(`🎯 Actividad extraída: ${activityInfo.originalName}`);
        console.log(
          `⏰ Horario: ${activityInfo.hourStart} - ${activityInfo.hourFinish}`
        );
        console.log(`📅 Días: ${activityInfo.days.join(", ")}`);

        const targetActivity = await findActivityByCriteria(activityInfo);

        if (!targetActivity) {
          console.log(
            `❌ No se encontró la actividad para ${deactivatedUser.nombre}`
          );
          skippedCount++;
          continue;
        }

        console.log(`🎯 Actividad encontrada: ${targetActivity.name}`);

        const isAlreadyInActivity = targetActivity.users.some(
          (activityUserId) =>
            activityUserId.toString() === deactivatedUser._id.toString()
        );

        if (isAlreadyInActivity) {
          console.log(
            `ℹ️ ${deactivatedUser.nombre} ya está en esta actividad específica`
          );
          skippedCount++;
          continue;
        }

        const activityUpdateResult = await Activity.updateOne(
          { _id: targetActivity._id },
          {
            $addToSet: { users: deactivatedUser._id },
            $inc: { userRegister: 1 },
          }
        );

        const userBasicUpdateResult = await User.updateOne(
          { _id: deactivatedUser._id },
          {
            $set: {
              status: true,
              revisionArchivo: "aprobado",
            },
            $addToSet: {
              activity: targetActivity._id,
            },
          }
        );

        const removeNotificationResult = await User.updateOne(
          { _id: deactivatedUser._id },
          {
            $pull: {
              notificaciones: {
                _id: deactivationNotification._id,
              },
            },
          }
        );

        if (
          activityUpdateResult.modifiedCount > 0 &&
          userBasicUpdateResult.modifiedCount > 0 &&
          removeNotificationResult.modifiedCount > 0
        ) {
          console.log(`✅ ${deactivatedUser.nombre} reactivado exitosamente`);
          console.log(`✅ Status actualizado a: true`);
          console.log(`✅ RevisionArchivo actualizado a: aprobado`);
          console.log(`✅ Actividad agregada al usuario`);
          console.log(`🗑️ Notificación de baja de agosto 2025 eliminada`);
          console.log(`📧 Nueva notificación de reactivación agregada`);

          reactivatedCount++;
        } else {
          console.log(
            `❌ No se pudo reactivar completamente a ${deactivatedUser.nombre}`
          );
          console.log(
            `Actividad actualizada: ${activityUpdateResult.modifiedCount > 0}`
          );
          console.log(
            `Usuario básico actualizado: ${
              userBasicUpdateResult.modifiedCount > 0
            }`
          );
          console.log(
            `Notificación eliminada: ${
              removeNotificationResult.modifiedCount > 0
            }`
          );

          errorCount++;
        }
      } catch (userError) {
        console.error(
          `❌ Error procesando usuario ${deactivatedUser.nombre}:`,
          userError.message
        );
        errorCount++;
      }
    }

    console.log(`\n🎉 PROCESO COMPLETADO - ESTADÍSTICAS FINALES:`);
    console.log(`📊 Total de usuarios encontrados: ${deactivatedUsers.length}`);
    console.log(`✅ Usuarios reactivados exitosamente: ${reactivatedCount}`);
    console.log(`⚠️ Usuarios omitidos (ya tenían actividad): ${skippedCount}`);
    console.log(`❌ Errores durante el proceso: ${errorCount}`);
    console.log(
      `📈 Tasa de éxito: ${(
        (reactivatedCount / deactivatedUsers.length) *
        100
      ).toFixed(1)}%`
    );
  } catch (error) {
    console.error("❌ Error general reactivando usuarios:", error.message);
  }
};

const main = async () => {
  await connectDB();
  await reactivateUsers();
  await mongoose.connection.close();
  console.log("🔌 Conexión cerrada");
};

main().catch(console.error);
