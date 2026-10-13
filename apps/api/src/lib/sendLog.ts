import { encrypt } from "./encrypt.ts";
import type { FastifyInstance } from "fastify";

const sleep = (ms:number) => new Promise(res => setTimeout(res, ms));

export async function sendLog(machine:string, appKey:string, msg:string, fastify:FastifyInstance, retries = 0, retryLimit = 3){
	const date = new Date(Date.now()).toISOString().split("T").join(" ");
	const encryptedKey = await encrypt(appKey);
	msg = msg === "object" ? JSON.stringify(msg) : msg;

	try{
		const res:any = await fetch(machine, {
			method:"POST",
			body:msg,
			headers:{ 
				"Content-type":"application/json",
				"x-app-key": JSON.stringify(encryptedKey)
			}
		}).then(res => res.json());

		if(!res.ok){
			fastify.log.debug(`Failed to send log ${date}`);
			throw new Error("Failed to deliver log msg");
		};

	}catch(e:Error | any){
		if(retries >= retryLimit){
			fastify.log.error(`Failed retry attempts on health check`);
			throw new Error("Max health check reached");
		};

		const delay = 2000 * 2 ** retries;
		await sleep(delay);

		return await sendLog(machine, appKey, msg, fastify, retries + 1);
	}	
}
