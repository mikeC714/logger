import { Log } from "../app/log.ts";

export class Methods {
	constructor(private log: Log) {}

	async create(logName: string): Promise<boolean> {
		try {
			await this.log.create(logName);
			return true;
		} catch (e) {
			console.error(`FAILURE. Failed to create Log: ${logName}.`, e);
			return false;
		}
	}

	async delete(logName: string): Promise<boolean> {
		try {
			await this.log.delete(logName);
			return true;
		} catch (e: any) {
			console.error(`FAILURE. Failed to delete Log: ${logName}. ${e?.message}`);
			return false;
		}
	}

	async filter(value:string):Promise<Array<string>> {
		return await this.log.filter(value);
	}
}

