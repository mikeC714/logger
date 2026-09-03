import { Database } from "bun:sqlite";

export class DB{
	constructor(private db:Database){}

	store = (key:string, path:string) => {
		this.db.run("INSERT OR REPLACE INTO paths (key,path) VALUES (?,?)", [key, path]);
	}
	
	getAll = ():Array<{key:string, path:string}> => {
		return this.db.query("SELECT key, path FROM paths").all() as Array<{ key:string, path:string }>;
	}

	delete = (key:string) => {
		this.db.run("DELETE FROM paths WHERE key = ?", [key]);
	}

}
