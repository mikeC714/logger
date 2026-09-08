import { Database } from "bun:sqlite";

export class DB{
	private limit:number = 40;

	constructor(private db:Database){}

	create = (key:string, path:string) => {
		try{
			this.db.run("INSERT OR REPLACE INTO logs (project_key, ) VALUES (?,?)", [key, path]);
		}catch(e){

		}
	};

	getAllKeys = () => {
		try{
			return this.db.query("SELECT key FROM logs").all() as Array<{ key:string, path:string }>;
		}catch(e){
			console.error("Failed to get log keys", e);	
		}
	};

	deleteLog = (key:string) => {
		try{
			this.db.run("DELETE FROM logs WHERE key = ?", [key]);
		}catch(e){
			console.error("Failed to delete log", e);	
		}
	};

	getPreviewLogs = (key:string) => {
		try{
			const logs = this.db.query("SELECT * FROM logs WHERE key = ? ORDER BY rowid DESC LIMIT = ?").all(key, this.limit);
			return logs;
		}catch(e){
			console.error("Failed to fetch log to preview", e);	
		}
	};

	getLog = (key:string) => {
		try{
			return this.db.query("SELECT * FROM logs WHERE key = ?").all(key);
		}catch(e){
			console.error("Failed to fetch log", e);	
		}
	};

	write = (key:string, logs:Array<{lvl:string, msg:string, meta:object}>) => {
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
			})();
		}catch(e){
			console.error("Failed to write to log data.", e);	
		}
	};

};

