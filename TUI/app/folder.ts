import { logDir } from "../config/app.config.ts";
import fs from "node:fs/promises";
import { join } from "node:path";

export class Folder {
	protected dirPath = logDir;
	protected PathMap:Map<string, string> = new Map();

	public data = ():ReadonlyMap<string, string> => {
		return this.PathMap; 
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
			await fs.mkdir(logPath, { recursive:true });
			await fs.mkdir(archivePath, { recursive: true });

			for(const head of HEADERS){
				await fs.appendFile(liveFilePath, head, "utf8");
			}

			this.PathMap.set(name, liveFilePath);
			this.PathMap.set(`${name}:archive`, archivePath);
		}catch(e){
		}
	};

	rotate = async(name:string) => {
		const HEADERS = [ "ID", "MSG", "DATE" ].join("  ");
		const archive = this.PathMap.get(`${name}:archive`);
		const DATE = new Date(Date.now()).toLocaleString().replace(",", "_");	
		const livePath = join(this.dirPath, name);

		const data = await this.get(name);
		if(data === undefined) return `Log: ${name} not found.`; 

		const archivePath = join(archive as string, `${DATE}.csv`);
		const liveFilePath = join(livePath, `${name}.csv`);

		try{
			await fs.rename(data, archivePath);
			for(const head of HEADERS){
				await fs.appendFile(liveFilePath, head, "utf8");
			}
			this.PathMap.set(name, liveFilePath);
		}catch(e){
		}	
	};

	rename = async(newPathName:string, name:string) => {
		try{
			const live = await this.get(name);

			const newPath = join(this.dirPath, newPathName);
			const newLiveFilePath = join(newPath, `${newPathName}.csv`);

			await fs.rm(live as string, { recursive:true, force:true });
			await fs.mkdir(newPath, { recursive:true });
			await fs.appendFile(newLiveFilePath, "  ", "utf8");


			this.PathMap.set(newPathName, newLiveFilePath);
			this.PathMap.delete(name);

			return{
				new: this.PathMap.get(newPathName),
				old: this.PathMap.get(name)
			};
		}catch(e){
		}
	}

	delete = async(name:string) => {
		try{
			const live = await this.get(name);
			const archive = await this.get(`${name}:archive`);

			if(live !== undefined && archive !== undefined){
				await Promise.allSettled([
					fs.rm(live as string),
					fs.rm(archive as string),
				]);

				this.PathMap.delete(name);
				this.PathMap.delete(`${name}:archive`);

				return `Log: ${name} successfully deleted.`;
			}
			return `Log: ${name} doesn't exist.`;	
		}catch(e){
		}
	}
};

