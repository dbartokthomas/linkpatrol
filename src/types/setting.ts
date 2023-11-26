import { Credential } from "./credential";

export interface Setting {
  source: string;
  credentials: Credential[];
}
