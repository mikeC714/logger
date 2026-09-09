import { Database } from "bun:sqlite";
import type { MSG } from "../types/msgData.d.ts";

export class DB{
	private limit:number = 40;

	constructor(private db:Database){}


	// CREATING
	// RECIEVING 
	// DELETING
	// ALL KEY RELATED

	create = (key:string) => {
		try{
			this.db.run("INSERT INTO bank (project_key) VALUES (?,?)", [key]);
		}catch(e){
		
		}
	};
	getAllKeys = () => {
		try{
			return this.db.query("SELECT key FROM bank").all() as Array<string>;
		}catch(e){
			console.error("Failed to get log keys", e);	
		}
	};
	deleteKey = (key:string) => {
		try{
			this.db.run("DELETE FROM bank WHERE key = ?", [key]);
		}catch(e){
			console.error("Failed to delete log", e);	
		}
	};


	// RECIEVING 
	// DELETING
	// WRITTING
	// ALL LOG RELATED

	getPreviewLogs = (key:string) => {
		try{
			const logs = this.db.query("SELECT * FROM logs WHERE key = ? ORDER BY rowid DESC LIMIT = ?").all(key, this.limit);
			return logs;
		}catch(e){
			console.error("Failed to fetch log to preview", e);	
		}
	};

	getAllLogs = async(key:string) => {
		try{
			return this.db.query("SELECT * FROM logs WHERE key = ?").all(key);
		}catch(e){
			console.error("Failed to fetch log", e);	
		}
	};

	write = async(key:string, logs:Array<MSG>):Promise<void> => {
		const queryInsert = this.db.prepare("INSERT INTO logs (project_key, level, msg, meta)");
		try{
			this.db.transaction(() => {
				for(const log of logs){
					queryInsert.run({
						$project_key:key,
						$level:log.lvl,
						$msg:log.msg,
						$meta:JSON.stringify(log.meta)
					});
				}
			});
		}catch(e){
		}
	};
};


