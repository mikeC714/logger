import { io } from "socket.io-client";

export function buildSocket(projectKey:string){
	const socket = io(process.env.SERVER,{
		auth:{
			key:process.env.SOCKET_KEY,
			projectKey,
		},
		reconnection:true,
		reconnectionAttempts:3,
		reconnectionDelayMax:10000,
		retries:4,
		timeout:1000
	});
	socket.on("connected", (data:boolean) => data);
	socket.on("archive", (data) => JSON.parse(data));

	return socket;
}
