import { io } from "socket.io-client";
import { Log } from "../app/log.ts";
import type { MSG_DATA } from "../types/msgData.d.ts";

const socket = io(process.env.SERVER,{
	auth:{
		key:process.env.SOCKET_KEY,
	},
	reconnection:true,
	reconnectionAttempts:3,
	reconnectionDelayMax:10000,
	retries:4,
	timeout:1000
});


const log = new Log();

export function Socket(){
	socket.off("msg")
	socket.on("connect", () => {
		console.log("Connected.");
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
	socket.on("msg", (data:MSG_DATA) => {
		log.write(data);	
	});
}
