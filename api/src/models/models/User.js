import mongoose from "mongoose";

const schema = new mongoose.Schema({
  customId: {
    type: Number,
    unique: true,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
    minlength: 3,
  },
  apellido: {
    type: String,
    required: true,
    minlength: 3,
  },
  telefono: {
    type: String,
    minlength: 6,
  },
  telefonoContacto: {
    type: String,
    required: true,
    minlength: 6,
  },

  edad: {
    type: Number,
    required: true,
    maxlength: 2,
  },

  email: {
    type: String,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  },
  role: {
    type: String,
    required: true,
    minlength: 3,
  },
  dni: {
    type: String,
    required: true,
    unique: true,
    minlength: 7,
  },
  sexo: {
    type: String,
    required: true,
    minlength: 3,
  },
  ciudad: {
    type: String,
    required: true,
    minlength: 3,
  },
  barrio: {
    type: String,

    minlength: 3,
  },

  activity: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],

  notificaciones: [
    {
      asunto: String,
      cuerpo: String,
      leido: {
        type: Boolean,
        default: false, // Por defecto, la notificación no está leída
      },
    },
  ],

  emailVerificationToken: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  //quiero que asistencia sea un array de strings
  asistencia: {
    type: Array,
    required: false,
  },
  natacionAdaptada: {
    type: Boolean,
    required: false,
  },
  cud: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    required: false,
  },
  foto: {
    type: String,
    minlength: 3,
  },
  public_id_foto: {
    type: String,
    minlength: 3,
  },

  fichaMedica: {
    type: String,
    minlength: 3,
  },
  certificadoHongos: {
    type: String,
    minlength: 3,
  },
  fechaCargaCertificadoHongos: {
    type: String,
    minlength: 3,
  },
  mensaje: {
    type: String,
    minlength: 3,
  },

  // datos tutor
  nombreTutor: {
    type: String,
    minlength: 3,
  },
  apellidoTutor: {
    type: String,
    minlength: 3,
  },
  dniTutor: {
    type: String,
    minlength: 7,
  },
  emailTutor: {
    type: String,
    minlength: 3,
  },
  telefonoTutor: {
    type: String,
    minlength: 6,
  },
});

export default mongoose.model("User", schema);
