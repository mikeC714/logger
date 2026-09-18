import { buildTUI } from "./interface/main.ts";
import { initDB } from "./config/db.config.ts";
import { Socket } from "./config/socket.config.ts";
import { DB } from "./app/db.ts";
import { Log } from "./app/log.ts";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";
import { getLogs } from "./test/utils/logs.ts";
import type { Database } from "bun:sqlite";


function testFunc(database:Database){
	const write = database.prepare(`INSERT INTO logs (project_key, level, msg, meta) VALUES (?,?,?,?)`);

	const projectKey = "test_key_1";
	const logs = getLogs();

	try{
		database.run("INSERT INTO bank (project_key) VALUES(?)", [projectKey]);
		database.transaction(() => {
			for(const log of logs.logs){
				write.run(logs.projectKey, log.lvl, log.msg, JSON.stringify(log.meta));
			}
		})();
	}catch(e){
		console.error(e)
		throw e;

	}finally{
		write.finalize();
	};
};


async function MAIN(){
	const database = await initDB();
	testFunc(database);
	const db = new DB(database); 
	const log = new Log(db);

	await log.init();
	const tui = await buildTUI(log);

	process.on("SIGINT", () => {
		tui.destroy();
		process.exit(0);
	});
};
MAIN();
