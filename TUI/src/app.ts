import { buildTUI } from "./interface/main.ts";
import { initDB } from "./config/db.config.ts";
import { Socket } from "./config/socket.config.ts";
import { DB } from "./app/db.ts";
import { Log } from "./app/log.ts";
import { userInfo } from "node:os";
import type { MSG_DATA } from "./types/msgData.d.ts";
// import { getLogs } from "./test/utils/logs.ts";
// import { testFunc } from "./test/utils/init.ts";

export async function build(){
	try{
		// build Database
		// if the database is already instantiated it'll be reused
		// create instance of db method class
		const database = await initDB();
		const db = new DB(database); 

		const username = userInfo().username;
		

		 let user = await db.getUser(username);	
		
		if(user === null){
			 const newUser  = await db.createUser(username);
			 user = newUser.user 
		};

		// create instance of log method class
		const log = new Log(db);
		await log.init();

		// build socket
		const socket = await Socket(user);

		const { main, destroy } = await buildTUI(log, user);

		socket.on("msg", (body:MSG_DATA) => {
			log.write(body);	
			console.log("WROTE LOG")
			main.requestRender();
		});

		return destroy;

	}catch(e){
		throw e;
	}
};
