// import { test, expect, describe, afterEach, beforeEach } from "bun:test";
// import { Stream } from "../stream.ts";
// import { createServer } from "node:http";
// import { Server } from "socket.io";
// import { io as ioClient, type Socket as ClientSocket } from "socket.io-client";
//
// let http: ReturnType<typeof createServer>;
// let ioServer: Server;
// let clientSocket: ClientSocket;
//
//
// beforeEach(async() => {
// 	http = createServer();
// 	ioServer = new Server(http);
//
// 	await new Promise<void>((res) => {
// 		http.listen(() => {
// 			const port = (http.address() as any).port;
// 			clientSocket = ioClient(`http://localhost:${port}`);
//
// 			ioServer.on("connection", (socket) => {
// 				socket.emit("connected", true);
// 			});
// 			clientSocket.on("connected", res);
// 		})
// 	})
// })
//
// afterEach(() => {
// 	ioServer.close();
// 	clientSocket.close();
// 	http.close();
// })
