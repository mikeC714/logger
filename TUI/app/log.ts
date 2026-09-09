import { db } from "../config/db.config.ts";
import { DB } from "./db.ts";
import { logDir } from "../config/app.config.ts";
import type { MSG_DATA } from "../types/msgData.d.ts";


export const LOG_COLUMNS = ["id", "msg", "metaData", "timestamp"] as const;
export class Log {
	protected dirPath = logDir;
	protected LogKeys:Array<string> = [];
	private db = new DB(db);
	private MAX_PREVIEW_ENTRIES:number = 40;

	init = async() => {
		try{
			const rows = this.db.getAllKeys();
			if(rows === undefined) return;

			for(const row of rows){
				this.LogKeys.push(row)
			}
		}catch(e){

		}
	}

	// CREATING A BANK
	create = (name:string) 	=> {
		try{
			this.db.create(name);
		}catch(e){

		}
	};

	// DELETE BANK
	delete = (name:string) => {
		try{
			this.db.deleteKey(name);
		}catch(e){

		}
	};

	// WRITE TO LOG
	write = async(data:MSG_DATA) => {
		const [projectKey, logs] = data;
		try{
			await this.db.write(projectKey, logs);
		}catch(e){

		}
	};

	// PREVIEW LOG
	preview = (name:string) => {
		try{
			this.db.getPreviewLogs(name);
		}catch(e:any){

		}
	}
	
	getAllLogs = async(name:string) => {
		try{
			await this.db.getAllLogs(name);
		}catch(e){
		}
	}

};

