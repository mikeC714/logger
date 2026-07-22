import { ERROR } from "../src/api/error.api.ts";

type NEW_LOG = {
	project:string;
	name:string;
}

interface BODY{
	new_log: NEW_LOG;
}

export class COMMANDS{
	private readonly commands = [
		"Q", // QUIT
		"N", // NEW LOG/ NEW USER 
		"L", // LOGIN 
		"J", // JOIN
	];
	private async quit(){
		await fetch(`${process.env.SERVER}/api/end`,{
			method:"POST",
			headers:{
				"Content-Type": "application/json"
			}
		})
			.then(async res => {
				if(!res.ok){
					console.log(`ERROR:`,res);
					await ERROR(res);
				}
				return res.json();
			})
			.catch(err => {
				console.error(`FAILURE: ${err}`)
			})
	}
	private async new_log(log:BODY["new_log"]){
		await fetch(`${process.env.SERVER}/api/log/new`,{
				method:"POST",
				headers:{
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					project: log.project,
					name: log.name.length === 0 || log.name === undefined ? log.name = log.project : log.name	
				})
			})
				.then(async res => {
					if(!res.ok){
						console.log(`ERROR:`,res);
						await ERROR(res);
					}
					return res.json();
				})
				.catch(err => {
					console.error(`FAILURE: ${err}`)
				})
	}	
	process_command(body:BODY){
		process.stdin.on("keypress", async (key) => {
			if(key.ctrl && key.name === "Q"){
				await this.quit()
			}else if(key.ctrl && key.name === "N"){
				await this.new_log(body["new_log"])
			}
			 //else if(key.ctrl && key.name === "J"){
			// 	await this.join(code)
			// }
		})
	}
}

