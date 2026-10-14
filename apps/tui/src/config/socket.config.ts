import { io } from "socket.io-client";


export async function Socket(userKey:string){

	//change to host 
	const socket = io(process.env.SERVER,{
		auth:{
			userKey,	
			key:process.env.SOCKET_KEY,
		},
		autoConnect:true,
		reconnection:true,
		reconnectionAttempts:3,
		reconnectionDelayMax:10000,
		retries:4,
		timeout:1000
	});

	socket.on("connected", (bool:boolean) => {
		console.log(`Connected:${bool}.`);
	});
	socket.on("disconnect", (reason) => {
		console.log("Disconnected");
	});
	socket.on("connection_error", (err) => {
		console.error(`Failed to connect: ${err}`);
	});
	socket.on("reconnection_attempt", (attempt) => {
		console.log(`Reconnecting: ${attempt}`);
	});

	return socket;
}
