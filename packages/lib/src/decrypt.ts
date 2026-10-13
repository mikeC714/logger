import { createDecipheriv } from "node:crypto";


export async function decrypt(payload:string):Promise<string>{
	const algo = "aes-256-gcm";
	const key = Buffer.from(process.env.MACHINE_SECRET!, "hex");
	const data = Buffer.from(payload, "base64");
	const iv = data.subarray(0, 12);
	const tag = data.subarray(12,28);
	const encrypted = data.subarray(28);
	const decipher = createDecipheriv(algo, key, iv);

	decipher.setAuthTag(tag);
	return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
};

