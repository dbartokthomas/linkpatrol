import { Credential } from "./credential";

export interface Source {
    source: string;
    credentials: Credential[];
}  