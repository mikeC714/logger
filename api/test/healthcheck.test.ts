import {describe, before, after, test} from "node:test";
import request from "supertest";
import assert from "node:assert";
import { build } from "../app.ts";


let app:any;
let req:any;
let key:any; 


before(async() => {
	try{
		app = await build()
		await app.listen({ port:3000, host:"localhost" });
		await app.ready();

		const jsonKey = process.env.MACHINES;
		if(jsonKey === undefined) throw new Error("Failed to instantiate valid machines"); 
		[key] = JSON.parse(jsonKey);
		
		req = request(app.server);
	}catch(e){
		throw e;
	}
})

after(async() => {
	await app.close();
});

test("GET. Call to get the health of the server", { timeout: 10000, } ,async() => {
	const res = await req	
				.get("/api/health")
				.set("x-machine-key", key);		
	assert.strictEqual(res.status, 200)
	assert.strictEqual(res.ok, true);
});

test("GET FAIL. Call health route should return error due to invalid header", async() => {
	const res = await req
				.get("/api/health")
				.set("x-machine-key", "fakeKeyGiveMeTheSecrets");		
	assert.strictEqual(res.status, 401);
});

test("GET FAIL. Health route returns 429 once rate limit is reached", {timeout:5000}, async () => {
	const MAX = 10; 

	for (let i = 0; i < MAX; i++) {
		const res = await req.get("/api/health").set("x-machine-key", key);
		assert.notStrictEqual(res.status, 500);
	}

	const res = await req.get("/api/health").set("x-machine-key", key);
	assert.strictEqual(res.status, 500);
});








