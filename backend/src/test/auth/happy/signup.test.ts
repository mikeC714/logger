import { build } from "../../../app.ts";
import { test, beforeEach, afterEach, describe, it, before, after } from "node:test";
import assert from "node:assert";

//TODO
	//TEST FOR SQLI

	let app:any;
	const MOCK = { username:"space_boi123", passphrase:"test_test_test" };

	before(async () => {
		app = build();
		await app.ready();
	})	

	after(async() => {
		await app.pg.rep.query(`TRUNCATE TABLE users`);
		await app.close();
	})

	const INJECT = async () => {
		let res = await app.inject({
			method:"POST",
			url:"/api/auth/signup",
			body:MOCK
		})	
		return res;
	}
	test("POST /api/auth/signup", async() =>{
		const res = await INJECT(); 
		assert.strictEqual(201, res.statusCode);
	})
