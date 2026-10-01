import { initDB } from "./config/db.config.ts";
import { Socket } from "./config/socket.config.ts";
import { DB } from "./app/db.ts";
import { Log } from "./app/log.ts";

export async function build(){
	try{
		// build Database
		// if the database is already instantiated it'll be reused
		// create instance of db method class
		const database = await initDB();
		const db = new DB(database); 

		// create instance of log method class
		const log = new Log(db);
		await log.init();

		// build socket
		await Socket(log);

		return { 
			database, 
			log
		};

	}catch(e){
		throw e;
	}
};
