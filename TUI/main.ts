import { buildTUI } from "./interface/main.ts";
import { getLogs } from "./test/utils/logs.ts";
import { testFunc } from "./test/utils/init.ts";
import { BUILD } from "./app.ts";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";




async function MAIN(){
	const { database, log } = await BUILD(); 

	//TODO
	//REMOVE ONCE DONE TESTING APPLICATION
	testFunc(database, getLogs);
	const tui = await buildTUI(log);

	process.on("SIGINT", () => {
		// spawn child thread 
		// child will handle the socket connection continuosly writting logs to db 
		tui.destroy();
		process.exit(0);
	});
};
MAIN();
