import { build } from "../app.ts";


try{
	/*
	 * WHAT WILL HAPPEN 
	 *
	 * build database. If database is already instantiated it'll be reused
	 * create instance of db methods
	 * create log instance 
	 * create socket
	 *
	* */

	await build();
}catch(e){
	console.error("FAILED. Child process creation failed.");
	process.exit(0);
}
