import type { Error } from "../types/error.d.ts";

export class LoggerService{
	private db:any;

	private async organize(err:Error):Promise<Array<Error>>{
		let list:any = [];

		const categories = ["4","3","5","2"];
		const errStatus = String(err?.statusCode);
		categories.forEach((num) =>{ 
			if(errStatus[0] == num) list.push(err); 
		})

		return list;
	}

	async log_err(err:Error, log_id:string):Promise<void>{
		try{
			await this.db.query(
				`INSERT INTO logs(error)
					VALUES($1)
					WHERE log_id = $2
				`,[err, log_id]
			);	
		}catch(error:any){
			throw {
				status: error.status || error.statusCode,
				message: error.message,
				trace: error.stack   
			}; 
		}			
	};
	// async log(body:)
}
