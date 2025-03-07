import { User } from "./user.model";

export interface Pileta {
  _id: string;
  pileta: string;
  dia: string;
  hora: string;
  users: User[];
  __v: number;
}
