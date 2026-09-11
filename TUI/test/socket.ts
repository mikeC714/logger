import { Server } from "socket.io";
import { createServer } from "node:http";
import { io, type Socket as ClientSocket } from "socket.io-client";
import { beforeAll, afterAll, beforeEach, afterEach, test, expect } from "bun:test";
import type { Server as IOServer, Socket as ServerSocket } from "socket.io"
import { socket } from "../config/socket.config.ts";
import { after } from "node:test";


let httpServer:ReturnType<typeof createServer>;
let ioServer:IOServer;
let port:number;


beforeAll(async() => {
	httpServer = createServer();
	ioServer = new Server(httpServer);

	await new Promise<void>((res) => {
		httpServer.listen(() => {
			const address = httpServer.address();
			port = typeof address === "object"  && address ? address.port : 0;
			res();
		})
	});
});

afterAll(() => {
	ioServer.close();
	httpServer.close();
});

let clientSocket:ClientSocket;
let serverSocket:ServerSocket;

beforeEach(async () => {
	await new Promise<void>((res) => {
		ioServer.once("connection", (socket) => {
			serverSocket = socket;
			res();
		})
		clientSocket = io(`http://localhost:${port}`);
	});

	await new Promise<void>((res) => {
		clientSocket.on("connect", res);
	});
});

afterEach(() => {
	ioServer.removeListener();
	clientSocket.disconnect();
});

test("Server connects to a client", async() => {
})




