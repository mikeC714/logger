import {describe, before, after, test} from "node:test";
import request from "supertest";
import assert from "node:assert";
import { build } from "../../app.ts";
import { log, buildSocket } from "./mocks.ts";


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
		await app.listen({ port:3000, host:"localhost"})
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

test("Send log to client socket", { timeout: 800_000, } ,async() => {
	console.time()
	const start = process.memoryUsage().heapUsed
	let res:any;
	for(let i = 0; i < 1000; i++){
		res = await req	
				.post("/api/log")
				.set("Content-type", "application/json")
				.send(log);	 
	}
	assert.strictEqual(res.ok, true);
	const end = process.memoryUsage().heapUsed
	const memory = end - start;
	console.log(`MEMORY USED MB:`,(memory / 1024 / 1024).toFixed(2));
	console.timeEnd()
})





