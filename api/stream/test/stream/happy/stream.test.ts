import {before, after, test} from "node:test";
import request from "supertest";
import assert from "node:assert";
import { build } from "../../../../app.ts";
import { io } from "socket.io-client";

const app:any = await build()
await app.ready();
const req = request(app);
const projectKey = "test_test123"

const client = io(`ws://${process.env.SERVER}`,{
	reconnection:true,
	reconnectionDelay:0,
	reconnectionDelayMax:1000,
	reconnectionAttempts:3,
	auth:{
		key:process.env.SOCKET_KEY,
		projectKey
		}
});
const body = [projectKey, [{lvl:"warn", msg:"Something is about to go bad.", meta:{}}]];

before(() => {
	client.on("connected", (data) => console.log(data));
	client.on("connection_error", (data) => console.log(data));
});
after(() => client.emit(("disconnect")));

test("POST api/log should successfully write to client socket", async() => {
	const res = await req		
				.post("/api/log")
				.set("Content-type","application/json")
				.send(body);
	
	assert.strictEqual(res.statusCode, 201);
})


// LOG COMES IN 
// HIT HTTP TO START PROCESSING MSG
// MSG IS WRITTEN TO REDIS STREAM
// MSG IS THEN READ AND SENT VIA WEBSOCKET
// CLIENT RECIVEVES MSG
// RETURNING THE DATA
