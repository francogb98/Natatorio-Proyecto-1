export interface User {
  _id: string;
  customId: number;
  nombre: string;
  apellido: string;
  edad: number;
  dni: string;
  sexo: string;
  natacionAdaptada: boolean;
  diagnosticos: string;
  telefono: string;
  telefonoContacto: string;
  ciudad: string;
  barrio: string;
  password: string;
  role: string;
  activity: Activity[];
  asistencia: string[];
  fechaCargaCertificadoHongos: string;
  notificaciones: Notificacion[];
  __v: number;
  public_id_foto: string;
  status: boolean;
  inasistencias: string[];
  fotoDocumento: string;
  foto: string;
  certificadoHongos: string;
  fichaMedica: string;
}

export interface Stadistic {
  _id: string;
  usersQuantity: number;
  dias: string[];
  mes: string;
  activity: string;
  __v: number;
}
export interface Activity {
  _id: string;
  name: string;
  pileta: string;
  hourStart: string;
  hourFinish: string;
  date: string[];
  users: User[];
  userRegister: number;
  stadistics: Stadistic[];
  cupos: number;
  actividadEspecial: boolean;
  natacionAdaptada: boolean;
  desde: number;
  hasta: number;
  __v: number;
  actividadHabilitada: boolean;
  codigoDeAcceso: string;
}

export interface Notificacion {
  asunto: string;
  cuerpo: string;
  leido: boolean;
  _id: string;
  fecha?: string;
}
