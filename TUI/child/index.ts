import { spawn } from "node:child_process";

// spawn a child thread when main thread is closed
// child thread will then accept the data from the server socket
// where the data is then written to sqlite
// once main thread is spun back up terminate child 

const child = spawn(process.execPath, [""], {
	detached:true,
	stdio:["ignore"],
});

child.unref();

