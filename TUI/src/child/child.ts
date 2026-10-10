import { writeFileSync, unlinkSync } from "node:fs";


/// spawn a child thread when main thread is closed
// child thread will then accept the data from the server socket
// where the data is then written to sqlite
// once main thread is spun back up terminate child 

export function spawnChild(execPath:string, pidPath:string){
	const child = Bun.spawn([process.execPath, execPath], {
		detached:true,
		stdio:["ignore", "ignore", "ignore"],
		env:{ ...process.env },
		onExit(){
			try{
				unlinkSync(pidPath);
			}catch(e){
				throw e;
			}
		}
	});

	child.unref();

	try{
		writeFileSync(pidPath, String(child?.pid));
	}catch(e){
		throw e;
	}

	return child;
};

