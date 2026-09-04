import { Database } from "bun:sqlite";

export class DB{
	constructor(private db:Database){}

	storePath = (key:string, path:string) => {
		this.db.run("INSERT OR REPLACE INTO paths (key,path) VALUES (?,?)", [key, path]);
	}
	
	getAllPaths = ():Array<{key:string, path:string}> => {
		return this.db.query("SELECT key, path FROM paths").all() as Array<{ key:string, path:string }>;
	}

	deletePath = (key:string) => {
		this.db.run("DELETE FROM paths WHERE key = ?", [key]);
	}

}
