import { db } from "../config/db.config.ts";
import { DB } from "./db.ts";
import type { MSG_DATA } from "../types/msgData.d.ts";


export const LOG_COLUMNS = ["id", "msg", "metaData", "timestamp"] as const;
export class Log {
	protected LogKeys:Set<string> = new Set();
	private db = new DB(db);

	init = async() => {
		try{
			const rows = this.db.getAllKeys();
			if(rows === undefined) return;

			for(const row of rows){
				this.LogKeys.add(row.project_key);
			}
		}catch(e){
			console.error("FAILURE. Failed to init log keys");	
			process.exit(1);
		};
	}

	list = ():[] | Array<string> => {
		let keys:Array<string> = [];
		if(this.LogKeys.size === 0) return keys;

		for(const key of this.LogKeys.values()){
			keys.push(key);
		};

		return keys;
	};

	filter = async(query:string):Promise<[] | Array<string>> => {
		let results:Array<string> = [];
		if(!this.LogKeys.has(query)) return results;

		for(const key of this.LogKeys.values()){
			if(key.includes(query)){
				results.push(key);
			};
		};

		return results;
	};


	// CREATING A BANK
	create = (projectKey:string) 	=> {
		if(this.LogKeys.has(projectKey)) return; 
		try{
			this.db.create(projectKey);
		}catch(e){
			console.error("FAILURE. Failed to create log");	
			process.exit(1);
		};
	};

	// DELETE BANK
	delete = (projectKey:string) => {
		if(!this.LogKeys.has(projectKey)) return;
		try{
			this.db.deleteKey(projectKey);
			this.LogKeys.delete(projectKey);
		}catch(e){
			console.error("FAILURE. Failed to delete log");	
			process.exit(1);
		}
	};

	// WRITE TO LOG
	write = async(data:MSG_DATA) => {
		const [projectKey, logs] = data;
		try{
			await this.db.write(projectKey, logs);
		}catch(e){
			console.error(`FAILURE. Failed to delete log: ${projectKey}`);	
			process.exit(1);
		}
	};

	// PREVIEW LOG
	preview = (projectKey:string) => {
		try{
			return this.db.getPreviewLogs(projectKey);
		}catch(e:any){
			console.error(`FAILURE. Failed to fetch log:${projectKey} previews`);	
			process.exit(1);

		}
	};
	
	// ALL LOGS FROM KEY
	getAllLogs = async(projectKey:string) => {
		try{
			return await this.db.getAllLogs(projectKey);
		}catch(e){
			console.error(`FAILURE. Failed to fetch all ${projectKey} logs`);	
			process.exit(1);
		}
	};
};

