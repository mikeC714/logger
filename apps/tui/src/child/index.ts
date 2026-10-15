import { build } from "../app.ts";


try{
	/*
	 * WHAT WILL HAPPEN 
	 *
	 * build database. If database is already instantiated it'll be reused
	 * create instance of db methods
	 * create log instance 
	 * create socket
	 * with the socket built the entirety of the app is basically be functioning just without an interface
	 * accepting msg data that'll be written to the database
	 *
	**/

	await build();
}catch(e){
	console.error("FAILED. Child process creation failed.");
	process.exit(0);
}
