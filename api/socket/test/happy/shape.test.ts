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



let socket:any;
let app:any;
let req:any;

before(async() => {
	app = await build()
	try{
		await app.listen({ port:3000, host:"127.0.0.1"})
		await app.ready();
		const url = `http://localhost:${app.server.address().port}`
		req = request(url);
		socket = await buildSocket(url);
	}catch(e){
		throw e;
	}
})

after(async() => {
	await new Promise<void>((res) => {
		socket.once("disconnect", () => res());
		socket.close();
	})
	await app.close();
});

test("Send log to client socket", { timeout: 10000, } ,async() => {
	const res = await req	
					.post("/api/log")
					.set("Content-type", "application/json")
					.send(log);	 

	assert.strictEqual(res.status, 201)
	assert.strictEqual(res.ok, true);
})








