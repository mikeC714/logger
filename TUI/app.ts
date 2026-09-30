import { initDB } from "./config/db.config.ts";
import { Socket } from "./config/socket.config.ts";
import { DB } from "./app/db.ts";
import { Log } from "./app/log.ts";

export async function BUILD(){
	try{
		const database = await initDB();
		const db = new DB(database); 
		const log = new Log(db, Socket);
		await log.init();

		return { 
			database, 
			log
		};

	}catch(e){
		throw e;
	}
};
