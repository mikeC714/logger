import {before, after, test} from "node:test";
import request from "supertest";
import assert from "node:assert";
import { build } from "../../../../app.ts";
import { io } from "socket.io-client";
import { Stream } from "../../../stream.ts";
import { SocketService } from "../../../ws/ws.service.ts";
import { Archive } from "../../../archive.ts";


const app:any = await build()
await app.ready();
const archive = new Archive(app.log, app.redis, app.io);
const socketService = new SocketService(app.io);
const stream = new Stream(app.redis, app.io, socketService, archive);

const body = ["test_test123", [{lvl:"warn", msg:"Something is about to go bad.", meta:{}}]];

const client = io(`ws://${process.env.SERVER}`,{
	reconnection:true,
	reconnectionDelay:0,
	reconnectionDelayMax:1000,
	reconnectionAttempts:3,
	auth:{
		key:process.env.SOCKET_KEY,
		projectKet:body[0]
	}
});

const req = request(app);

before(() => {
	client.on("connected", (data) => console.log(data));
	client.on("connection_error", (data) => console.log(data));
})

after(() => client.emit(("disconnect")));

test("POST api/log should successfully write to client socket", async() => {
	const res = await req		
				.post("/log")
				.set("Content-type","application/json")
				.send(body);
	
	assert.strictEqual(res.statusCode, 201);
})
