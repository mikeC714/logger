import dotenv from "dotenv";
dotenv.config();
import { date } from "./utils/date.ts";
import { build } from "./app.ts";


const server = await build();

try{
	await server.listen({ port: Number(process.env.PORT), host:"localhost"})
}catch(e:any){
	if(e){
		server.log.error(`Server failure:${e} time:${date}`);
	}
	throw new Error(e);
}


