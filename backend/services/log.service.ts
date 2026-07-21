import type { LOG_ERR } from "../types/error.d.ts";
import crypto from "node:crypto";

export class LoggerService{
	private db:any;
	private name:string = "";

	constructor(){
		this.init();
	}

	private async init(){
		if(this.name.length === 0 || !this.name) this.name = "LOGGER";	
		const id = crypto.randomUUID();	
		return async function build_tui(){
			try{
			//TODO
				//BUILD TUI HERE 
			}catch(err){
				throw err;
			}
		}
	}

	private async connect(log_name:string, log_id:string){
		return async function gen_tui(){
			//TODO
				//GEN TUI WITH LOGS FOUND USING log_id WITH log_name PROBABLY GOING TO USE REDIS TO STORE LOGS NOT TOO SURE

		}
	}

	private async organize(err:LOG_ERR["ERR"]):Promise<Array<Error>>{
		let list:any = [];
		const categories = ["4","3","5","2"];
		const errStatus = String(err?.status);
		categories.forEach((num) =>{ 
			if(errStatus[0] == num) list.push(err); 
		})
		return list;
	}

	async log_err(err:LOG_ERR, log_id:string):Promise<void>{
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
