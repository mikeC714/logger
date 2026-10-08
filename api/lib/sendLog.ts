import { encrypt } from "./encrypt.ts";

export async function sendLog(machine:string, appKey:string, msg:string){
	const encryptedKey = await encrypt(appKey);
	msg = msg === "object" ? JSON.stringify(msg) : msg;

	try{
		const res = await fetch(machine, {
			method:"POST",
			body:msg,
			headers:{ 
				"Content-type":"application/json",
				"x-app-key": JSON.stringify(encryptedKey)
			}
		}).then(res => res.json());

		if(!res.ok){
			throw new Error("Failed to deliver log msg");
		};

	}catch(e){
		throw e;
	}	
}
