import { buildTUI } from "./interface/main.ts";
import { initDB } from "./config/db.config.ts";
import { Socket } from "./config/socket.config.ts";
import { DB } from "./app/db.ts";
import { Log } from "./app/log.ts";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";

async function MAIN(){
	const database = await initDB();
	const db = new DB(database); 
	const log = new Log(db);

	await log.init();
	await buildTUI(null, log);

	process.on("SIGINT", () => {
		buildTUI(true, null);
		process.exit(0);
	});
};
MAIN();
