import { buildTUI } from "./interface/main.ts";
import { getLogs } from "./test/utils/logs.ts";
import { testFunc } from "./test/utils/init.ts";
import { build } from "./app.ts";
import { spawnChild } from "./child/child.ts";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";



// when working on download path os module may need to come into play not too sure currently looking into it
const execPath = join(import.meta.dir, "/child/child.ts");
const pidPath = join(import.meta.dir, "./child/child.pid");

async function main(){
	let pid:string | number;
	try{
		 pid = readFileSync(pidPath, "utf8");
		 if(pid) process.kill(Number(pid), "SIGTERM"); 
	}catch{ }

	const { database, log } = await build(); 

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

	process.on("exit", () => spawnChild(execPath, pidPath))
};
main();
