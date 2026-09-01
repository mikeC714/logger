import { io } from "socket.io-client";
import { Stream } from "../app/stream.ts";
import type { SOCKET_DATA } from "../types/socket.d.ts";
import type { JSON } from "../types/json.d.ts";

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


export function Socket(){
	const stream = new Stream();

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
	socket.on("msg", (fn:(ack:boolean) => boolean) => {
		fn(true);
	});
	socket.on("ackedMsg", (msg:JSON<SOCKET_DATA>) => {
		stream.msg(JSON.parse(msg));	
	});
}
