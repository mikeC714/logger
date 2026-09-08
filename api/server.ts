import dotenv from "dotenv";
dotenv.config();
import { build } from "./app.ts";

const server = await build();
try{
	await server.listen({ port: Number(process.env.PORT), host:"localhost"})
}catch(e:any){
	if(e){
		server.log.error(`ERROR: ${e}`);
	}
	throw new Error(e);
}


