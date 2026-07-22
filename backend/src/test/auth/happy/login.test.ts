import { build } from "../../../app.ts";
import bcrypt from "bcrypt";
import { test, describe, it, before, after } from "node:test";
import assert from "node:assert";

	let app:any;
	const MOCK = { username:"user", passphrase:"test_test_test" };

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

	after(async() => {
		await app.pg.rep.query(`TRUNCATE TABLE users`);
		await app.close();
	})

	const INJECT = async (overide?:any) => {
		const MOCK_USER = {
			...MOCK,
			...overide
		}	
		let res = await app.inject({
			method:"POST",
			url:"/api/auth/login",
			body:MOCK_USER
		})	
		return res;
	}

	test("POST /api/auth/login", async() =>{
		const res = await INJECT(); 
		console.log(res);
		assert.strictEqual(200, res.statusCode);
	})
