import mongoose from "mongoose";
import ExcelJS from "exceljs";
import { User } from "../models/User.js";
import { Activity } from "../models/Actividades.js";
import dotenv from "dotenv";

dotenv.config();
// Reemplaza con tu cadena de conexión a MongoDB
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATA}/?retryWrites=true&w=majority`;

async function generateExcelFiles() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a la base de datos de MongoDB");

    // Definir las actividades que quieres buscar (puedes ajustar los nombres o la lógica de búsqueda)
    const activitiesToFind = [
      { hourStart: "18:00", hourFinish: "19:00" },
      { hourStart: "19:00", hourFinish: "20:00" },
    ];

    for (const activityInfo of activitiesToFind) {
      const { hourStart, hourFinish } = activityInfo;

      // Buscar la actividad que coincida con el horario
      const activity = await Activity.findOne({
        hourStart: hourStart,
        hourFinish: hourFinish,
        date: { $in: ["Lunes", "Miercoles", "Viernes"] }, // Ajusta si el campo `date` contiene otros valores
      }).populate("users"); // Rellenar los datos de los usuarios inscritos

      if (!activity) {
        console.log(
          `No se encontró una actividad para el horario de ${hourStart} a ${hourFinish}.`
        );
        continue;
      }

      const users = activity.users;

      if (users.length === 0) {
        console.log(
          `No hay usuarios inscritos en la actividad de ${hourStart} a ${hourFinish}.`
        );
        continue;
      }

      // Crear un nuevo libro y hoja de trabajo de Excel
      const workbook = new ExcelJS.Workbook();
      const worksheetName = `Usuarios ${hourStart.replace(
        ":",
        "_"
      )}-${hourFinish.replace(":", "_")}`;
      const worksheet = workbook.addWorksheet(worksheetName);

      // Definir las cabeceras de las columnas
      worksheet.columns = [
        { header: "Id", key: "id", width: 20 },
        { header: "Nombre", key: "nombre", width: 20 },
        { header: "Apellido", key: "apellido", width: 20 },
        { header: "Edad", key: "edad", width: 10 },
        { header: "DNI", key: "dni", width: 15 },
      ];

      // Añadir los datos de los usuarios a la hoja de trabajo
      users.forEach((user) => {
        worksheet.addRow({
          id: user.customId,
          nombre: user.nombre,
          apellido: user.apellido,
          edad: user.edad,
          dni: user.dni,
        });
      });

      // Guardar el archivo de Excel
      const filename = `usuarios_actividad_${hourStart.replace(
        ":",
        "_"
      )}_${hourFinish.replace(":", "_")}.xlsx`;
      await workbook.xlsx.writeFile(filename);
      console.log(`Archivo ${filename} creado exitosamente.`);
    }
  } catch (error) {
    console.error("Error al generar los archivos de Excel:", error);
  } finally {
    // Desconectar de la base de datos
    await mongoose.disconnect();
    console.log("Desconectado de la base de datos de MongoDB");
  }
}

generateExcelFiles();
