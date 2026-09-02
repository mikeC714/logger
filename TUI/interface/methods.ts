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

	filter(value: string): string[] {
		return this.log.filter(value);
	}
}

