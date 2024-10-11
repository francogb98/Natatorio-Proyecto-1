import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    }, // Actividad actual
    activityBaja: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" }, // Actividad de baja (opcional)
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Usuario relacionado
    asunto: { type: String, required: true }, // Asunto de la petición
    motivo: { type: String }, // Motivo de la petición (opcional)
    estado: { type: String, default: "pendiente" }, // Estado inicial de la petición
    pedido: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
); // Añadir timestamps para createdAt y updatedAt

const Peticion = mongoose.model("Peticiones", schema);

export { Peticion };
