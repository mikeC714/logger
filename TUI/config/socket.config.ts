import { io } from "socket.io-client";
import { Stream } from "../main/live.ts";
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

const stream = new Stream();
socket.on("connected", (data:boolean) => data);
socket.off("msg");
socket.on("msg", (fn:(ack:boolean) => boolean) => {
	fn(true);
});
socket.on("ackMsg", (msg:JSON<SOCKET_DATA>) => {
	stream.msg(msg);
});

