import { encrypt } from "./encrypt.ts";
import type { FastifyInstance } from "fastify";

const sleep = (ms:number) => new Promise(res => setTimeout(res, ms));

export async function callHealthCheck(machine:string, appKey:string, fastify:FastifyInstance, retryLimit = 3, retries = 0){
	const date = new Date(Date.now()).toISOString().split("T").join(" ");

	try{
		const encryptedKey = await encrypt(appKey); 

		// call the health endpoint
		const res:any = await fetch(`${machine}/api/health`, {
			method:"GET",
			headers:{
				"x-app-key": JSON.stringify(encryptedKey) 
			}
		}).then(res => res.json());	


		//check if fetch call failed
		//if so throw err and log
		if(!res.ok){
			fastify.log.debug(`Failed health check ${date}`);
			throw new Error(`Failed to check health`);
		};
		
		fastify.log.info(`Logger is healthy.`);
		return;

	// catch error
	// but instead of throwing the error immediately retry
	// check if retry count is >= retryLimit 
	// if it is then throw an error
	// if not call function recursively 
	// incrementing the delay using the number of retries  
	
	}catch(e:Error | any){
		if(retries >= retryLimit){
			fastify.log.error(`Failed retry attempts on health check`);
			throw new Error("Max health check reached");
		};

		const delay = 2000 * 2 ** retries;
		await sleep(delay);

		return await callHealthCheck(machine, appKey, fastify, retries + 1);
	}		
}
