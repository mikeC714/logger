import { spawn } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";



/// spawn a child process when main process is closed
// child process will then accept the data from the server socket
// data is then written to sqlite
// once main process is spun back up terminate child 

export function spawnChild(execPath:string, pidPath:string){
	const child = spawn(process.execPath, [execPath], {
		detached:true,
		stdio:["ignore", "ignore", "ignore"],
		windowsHide:true,
		env:{ ...process.env },
	});

	try{
		writeFileSync(pidPath, String(child?.pid));
	}catch(e){
		throw e;
	}

	child.unref();


	return child;
};

