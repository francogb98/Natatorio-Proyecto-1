export enum DateElement {
  Jueves = "Jueves",
  Lunes = "Lunes",
  Martes = "Martes",
  Miercoles = "Miercoles",
  Viernes = "Viernes",
}

export enum Pileta {
  Pileta25 = "pileta 25",
  Pileta50 = "pileta 50",
}

export interface Actividad {
  _id: string;
  name: string;
  pileta: Pileta;
  hourStart: string;
  hourFinish: string;
  date: string[];
  users: string[];
  userRegister: number;
  stadistics?: any[];
  cupos: number;
  actividadEspecial: boolean;
  natacionAdaptada: boolean;
  desde: number | null;
  hasta: number | null;
  __v: number;
  actividadHabilitada: boolean;
  codigoDeAcceso: string;
}
