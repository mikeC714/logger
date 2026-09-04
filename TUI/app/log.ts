import { db } from "../config/db.config.ts";
import { DB } from "./db.ts";
import { readFile, mkdir, rm, appendFile, rename } from "node:fs/promises";
import { logDir } from "../config/app.config.ts";
import { join } from "node:path";
import { parseCsv } from "../utils/parseCsv.ts";
import type { LOG_ENTRY } from "../types/log.d.ts";


export const LOG_COLUMNS = ["id", "msg", "metaData", "timestamp"] as const;
export class Log {
	protected dirPath = logDir;
	protected PathMap:Map<string, string> = new Map();
	private db = new DB(db);
	private MAX_PREVIEW_ENTRIES:number = 40;

	init = async() => {
		try{
			const rows = this.db.getAllPaths();
			for(const row of rows){
				this.PathMap.set(row.key, row.path);
			}
		}catch(e){

		}
	}

	private store = async(key:string, path:string) => {
		this.PathMap.set(key,path);
		this.db.storePath(key,path);
	}

	list = ():Array<string> => {
		let list = [];
		for(const [key, paths] of this.PathMap){
			list.push(key);
		}
		return list;
	}	

	get = async(name:string) => {
		if(this.PathMap.has(name)) return this.PathMap.get(name);
		return;
	};

	create = async(name:string) => {
		const HEADERS = [ "ID", "MSG", "DATE" ].join("  ");
		const logPath = join(this.dirPath, name);	
		const liveFilePath = join(logPath, `${name}.csv`);
		const archivePath = join(logPath, "archive");

		try{
			await mkdir(logPath, {recursive: true})
			await Promise.all([
				mkdir(archivePath),
				appendFile(liveFilePath, HEADERS.toString(), "utf8")
			])
			await this.store(name, logPath);
		}catch(e){
		}
	};

	rotate = async(name:string) => {
		const HEADERS = [ "ID", "MSG", "DATE" ].join("  ");
		const DATE = new Date(Date.now()).toLocaleString().replace(",", "_");	

		const path = await this.get(name);
		if(path === undefined) return `Log: ${name} not found.`; 

		const archivePath = join(path, "archive");
		const archiveFilePath = join(archivePath, `${DATE}.csv`);
		const liveFilePath = join(path, `${name}.csv`);

		try{
			const newPath = await this.rename(path, name, liveFilePath, archiveFilePath);
			await appendFile(newPath, HEADERS.toString(), "utf8")
		}catch(e){
		}	
	};

	rename = async(path:string, name:string, currPath:string, archivePath:string):Promise<string> => {
		const newPath = join(path, `${name}.csv`);
		try{
			await rename(currPath, archivePath);
			await this.delete(name);
			await this.store(name, newPath);
			return newPath;
		}catch(e){
			throw e;
		}
	}

	delete = async(name:string) => {
		try{
			const path:string | undefined = await this.get(name);
			if(path !== undefined){
				await rm(path);
				this.db.deletePath(name);
				this.PathMap.delete(name);
				return `Log: ${name} successfully deleted.`;
			};
			return `Log: ${name} doesn't exist.`;	
		}catch(e){
		}
	}

	filter = async(query:string) => {
		query = query.toLowerCase();
		let results:Array<string> = []
		for(let [key, path] of this.PathMap){
			key = key.toLowerCase();
			if(key.includes(query)){
				results.push(key)	
			}
		}
		return results;
	};

	readRecent = async (name: string):Promise<Array<{id:string, msg:string, metaData:object, timestamp:string}>> => {
		const path = this.PathMap.get(name);
		if (!path) return [];
		const filePath = join(path, `${name}.csv`);
		let content: string;
		try{
			content = await readFile(filePath, "utf8");
		}catch {
			return [];
		}

		if (content.trim().length === 0) return [];
		let rows = await parseCsv(content);
		if (rows.length === 0) return [];

		return rows.slice(-this.MAX_PREVIEW_ENTRIES).map((row:any) => ({
			id: row[0] ?? "",
			msg: row[1] ?? "",
			metaData: row[2] ?? "",
			timestamp: row[3] ?? "",
		}));
	};
};

