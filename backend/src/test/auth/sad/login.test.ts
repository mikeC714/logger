import { build } from "../../../app.ts";
import bcrypt from "bcrypt";
import { test, afterEach, describe, it, before, after } from "node:test";
import assert from "node:assert";

//TODO
	//TEST FOR SQLI


	let app:any;
	let MOCK = { username:"user", passphrase:"test_test_test" };

	before(async () => {
		app = build();
		await app.ready();
		const safe = await bcrypt.hash(MOCK.passphrase, 4)
		await app.pg.rep.query(
			`INSERT INTO users(username, passphrase)
				VALUES($1, $2)
			`,[MOCK.username, safe]
		)
	})	

	afterEach(async() => {
		await app.pg.rep.query(`TRUNCATE TABLE users`);
	})
	after(async() => {
		await app.pg.rep.query(`TRUNCATE TABLE users`);
		await app.close();
	})

	const INJECT = async (overide?:any) => {
		 MOCK = {
			 ...MOCK,
			...overide
		}	
		let res = await app.inject({
			method:"POST",
			url:"/api/auth/login",
			body:MOCK
		})	
		return res;
	}

	test("FAIL INVALID PASSPHRASE POST /api/auth/login", async() =>{
		const res = await INJECT({ passphrase:"yo_mama_dumb_fat" }); 
		assert.strictEqual(401, res.statusCode);
	})
	test("FAIL INVALID USERNAME POST /api/auth/login", async() =>{
		const res = await INJECT({ username:"space_joe" }); 
		assert.strictEqual(401, res.statusCode);
	})
	test("FAIL VALIDATION ERROR POST /api/auth/login", async() =>{
		const res = await INJECT({ passphrase:"joedoe" }); 
		assert.strictEqual(400, res.statusCode);
	})
