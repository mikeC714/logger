import { DB } from "./db.ts";
import type { MSG_DATA } from "../types/msgData.d.ts";

export const LOG_COLUMNS = ["timestamp", "msg", "metaData"] as const;

export class Log {
	protected LogKeys:Map<string, string> = new Map();
	private db:DB;

	constructor(db:DB){
		this.db = db;
	};

	init = async() => {
		try{
			console.log("HIT INIT")
			const rows = this.db.getAllKeysNSecrets();
			console.log(rows);
			if(rows === undefined) return;

			for(const row of rows){
				this.LogKeys.set(row.project_key, row.secret);
			}
			console.log("FINISHED INIT")
		}catch(e){
			console.error("FAILURE. Failed to init log keys");	
			process.exit(1);
		};
	}

	list = ():Array<string> => {
		let keys:Array<string> = [];
		if(this.LogKeys.size === 0) return keys;

		for(const key of this.LogKeys.values()){
			keys.push(key);
		};

		console.log(keys)

		return keys;
	};

	filter = async(query:string):Promise<Array<[string, string]>> => {
		let results:Array<[string, string]> = [];
		for(const [key, secret] of this.LogKeys.entries()){
			if(key.includes(query)){
				results.push([key, secret]);
			};
		};

		return results;
	};


	// CREATING A BANK
	create = async(projectKey:string):Promise<void> => {
		if(this.LogKeys.has(projectKey)) return; 
		try{
			const secret = Bun.SHA256.hash(projectKey, "hex");
			this.db.create(projectKey, secret);
			this.LogKeys.set(projectKey, secret);
		}catch(e){
			console.error("FAILURE. Failed to create log");	
		};
	};

	// DELETE BANK
	delete = async(projectKey:string):Promise<void> => {
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

	getLogErrorAndWarnCount = async(projectKey:string) => {
		try{
			return await this.db.getWarnAndErrorCount(projectKey);
		}catch(e){
			console.log(`FAILURE. Failed to fetch all ${projectKey} warning and error count.`)
		}
	}

	filterLog = async(projectKey:string, query:string) => {
		try{
			return await this.db.getLogsUsingQuery(projectKey, query);
		}catch(e){
			console.log(`FAILURE. Failed to fetch queried logs.`)
			throw e;
		}
	}
};

