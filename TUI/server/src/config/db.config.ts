import { SQL } from "bun";

export const pg = new SQL(process.env.PG_URL as string); 

