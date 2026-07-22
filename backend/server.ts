import dotenv from "dotenv";
dotenv.config();
import { build } from "./app.ts";

export const server = build();

server.listen({ port: Number(process.env.PORT) }, async(err, address) => {
	if(err){
		server.log.error(err);
		console.error(`Error:${err}`);
		process.exit(1);
	};	
	console.log(`Server is listening on PORT:${address}`);
})


