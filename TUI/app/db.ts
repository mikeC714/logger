import { Database } from "bun:sqlite";
import type { MSG } from "../types/msgData.d.ts";

export class DB{
	private limit:number = 40;

	constructor(private db:Database){}


	// CREATING
	// RECIEVING 
	// DELETING
	// ALL KEY RELATED
	
	create = (key:string):boolean => {
		try{
			this.db.run("INSERT INTO bank (project_key) VALUES (?)", [key]);
			return true
		}catch(e){
			console.error(e);
			throw e;	
		}
	};
	getAllKeys = () => {
		try{
			return this.db.query("SELECT project_key FROM bank").all() as Array<{project_key:string}>;
		}catch(e){
			console.error("Failed to get log keys", e);	
		}
	};
	deleteKey = (key:string) => {
		try{
			this.db.run("DELETE FROM bank WHERE project_key = ?", [key]);
			return true;
		}catch(e){
			console.error("Failed to delete log", e);	
		}
	};
	deleteAllKeys = () => {
		try{
			this.db.query("DELETE FROM bank").run();
			return true;
		}catch(e){
		}
	}


	// RECIEVING 
	// DELETING
	// WRITTING
	// ALL LOG RELATED

	getPreviewLogs = async(key:string) => {
		try{
			const logs = this.db.query("SELECT * FROM logs WHERE project_key = ? ORDER BY rowid DESC LIMIT ?").all(key, this.limit);
			return logs;
		}catch(e){
			console.error("Failed to fetch log to preview", e);	
		}
	};

	getAllLogs = async(key:string) => {
		try{
			return this.db.query("SELECT * FROM logs WHERE project_key = ?").all(key);
		}catch(e){
			console.error("Failed to fetch log", e);	
		}
	};

	write = async(key:string, logs:Array<MSG>):Promise<boolean> => {
		const queryInsert = this.db.prepare("INSERT INTO logs (project_key, level, msg, meta) VALUES (?,?,?,?)");
		try{
			this.db.transaction(() => {
				for(const log of logs){
					queryInsert.run({
						project_key:key,
						level:log.lvl,
						msg:log.msg,
						meta:JSON.stringify(log.meta)
					});
				}
			});
			return true;
		}catch(e){
			console.error("FAILURE:", e);
			throw e;
		}finally{
			queryInsert.finalize();
		}
	};
};


