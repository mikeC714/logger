import {before, after, test} from "node:test";
import assert from "node:assert";
import { build } from ".././../../app.ts";
import {buildSocket } from "../mocks.ts";

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



let app:any;
let socket:any;

before(async() => {
	app = await build()
	try{
		await app.listen({ port:3000, host:"localhost" });
		await app.ready();
		const url = `http://localhost:${app.server.address().port}`
		socket = await buildSocket(url);
	}catch(e){
		console.error(e)
		throw e;
	}
})
after(async() => {
	await new Promise<void>((res) => {
		socket.emit("disconnect", res());
		socket.close()
	});
	return await app.close();
});

const expected = "TESTING_LOG_STREAM"
test("Testing Auth for socket", { timeout:1000 }, () => {
	const { projectKey, key } = socket.auth;
	assert.strictEqual(projectKey, expected);
	assert.strictEqual(key, process.env.SOCKET_KEY)
})









