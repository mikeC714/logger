import { Database } from "bun:sqlite";

export const db = new Database("", {
	strict:true,
	create:true,
	readwrite:true
});
