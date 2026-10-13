import { createCipheriv, randomBytes } from "node:crypto";


export async function encrypt(key:string):Promise<Buffer<ArrayBuffer>>{
	const algo = "aes-256-gcm";
	const iv = randomBytes(12);
	const cipher = createCipheriv(algo, process.env.APP_KEY_SECRET!, iv);
	
	let encrypted = Buffer.concat([cipher.update(key, "utf8") , cipher.final()]);
	const tag = cipher.getAuthTag();

	return Buffer.concat([iv, tag, encrypted]);
};
