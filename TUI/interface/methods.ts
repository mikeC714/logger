import { Log } from "../app/log.ts";

export class Methods {
	constructor(private log: Log) {}

	async create(logName: string): Promise<boolean> {
		try {
			this.log.create(logName);
			return true;
		} catch (e) {
			console.error(`FAILURE. Failed to create Log: ${logName}.`, e);
			return false;
		}
	}

	async delete(logName: string): Promise<boolean> {
		try {
			this.log.delete(logName);
			return true;
		} catch (e: any) {
			console.error(`FAILURE. Failed to delete Log: ${logName}. ${e?.message}`);
			return false;
		}
	}

	async refresh(logName:string):Promise<any>{
		try{
			return this.log.preview(logName);
		}catch(e:any){
			console.error(`FAILURE. Failed to refresh Log: ${logName}`);
			return;
		}
	}

	async filter(value:string):Promise<Array<string>> {
		return await this.log.filter(value);
	}

}

