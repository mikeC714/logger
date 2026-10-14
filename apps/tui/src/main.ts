import { build } from "./app.ts";
import { spawnChild } from "./child/child.ts";
import { readFileSync, unlinkSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import os from "node:os";




async function main(){

	// when working on download path os module may need to come into play not too sure currently looking into it
	const execPath = join(import.meta.dir, "./child/child.ts");
	const pidPath = join(import.meta.dir, "./child/child.pid");

	// obtain pid (PROCESS ID) from file
	// if value is returned it means child is still active
	// kill child
	// then delete pid file
	// once child is killed the main process can safely be spawned
	try{
		 let pid = readFileSync(pidPath, "utf8");
		 if(pid){
			 process.kill(Number(pid), "SIGTERM"); 
			 unlinkSync(pidPath);
			 process.stdout.write("DELETED CHILD");
		 };
	}catch(e:Error | any){
		if(e.code !== "ESRCH" && e.code !== "ENOENT"){
			throw e;
		}
	}

	 const destroy = await build(); 

	process.on("SIGINT", () => {
		// spawn child thread 
		// child will handle the socket connection continuosly writting logs to db 
		destroy();
		process.exit(0);
	});

	process.on("exit", () => spawnChild(execPath, pidPath))
};
main();
