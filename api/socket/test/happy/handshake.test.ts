import {describe, before, after, test} from "node:test";
import request from "supertest";
import assert from "node:assert";
import { build } from ".././../../app.ts";
import { log, buildSocket } from "../mocks.ts";

/**
 *  TEST WILL INCLUDE: 
 *  Client Socket
 *  HTTP
 * 
 * Client Socket:
 *
 * HandShake will be tested
 * Log Completion
 * Data Shape
 *
 *
 * HTTP:
 *
 * HandShake
 * POST req 201
 * Funneling data from server socket to client
 */


const app:any = await build()
await app.ready();
const req = request(app.server);

let socket:any;
before(async() => {
	socket = await buildSocket();
})
after(async() => {
	socket.emit("disconnect", () => "Finished Test");
	socket.close()
	await app.close();
});
test("Send log to client socket", async() => {
	const res = await req	
					.post("/api/log")
					.set("Content-type", "application/json")
					.send(log);	 
	console.log(res)
	assert.strictEqual(res.status, 201);
})










