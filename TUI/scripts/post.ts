import { logDir } from "../config/app.config.ts";
import { mkdirSync } from "node:fs";

try{
	mkdirSync(logDir, { recursive:true });
	console.log(`Created log directory: ${logDir}`);
}catch(e:any){
	console.error(`FAILURE: Could not create log directory: ${e.message}`);
}
