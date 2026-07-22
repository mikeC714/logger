import { build } from "../../../app.ts";
import bcrypt from "bcrypt";
import { test, beforeEach , afterEach, describe, it, before, after } from "node:test";
import assert from "node:assert";

//TODO
	//TEST FOR SQLI

describe("FAIL POST /api/auth/signup", async() => {
	let app:any;
	const MOCK = { username:"user", passphrase:"test_test_test" };

	before(async () => {
		app = build();
		await app.ready();
	})	

	const INJECT = async (overide?:any) => {
		const MOCK_USER = {
			...MOCK,
			...overide
		}	
		let res = await app.inject({
			method:"POST",
			url:"/api/auth/signup",
			body:MOCK_USER
		})	
		return res;
	}
	it("FAIL VALIDATION ERROR PASSWORD MINLENGTH POST", async() =>{
		const res = await INJECT({ passphrase:"yo_mama" }); 
		assert.strictEqual(400, res.statusCode);
	})
	it("FAIL VALIDATION ERROR USERNAME MINLENGTH POST", async() =>{
		const res = await INJECT({ username:"" }); 
		assert.strictEqual(400, res.statusCode);
	})

	describe("FAIL DUE TO EXISITING USER POST /api/auth/signup", async() => {
			before(async() =>{
				const safe = await bcrypt.hash(MOCK.passphrase, 4)
				await app.pg.rep.query(
					`INSERT INTO users(username, passphrase)
						VALUES($1, $2)
					`,[MOCK.username, safe]
				)
			})
			after(async() => app.pg.rep.query(`TRUNCATE TABLE users`));

			it("DUPE USER", async() => {
				const res = await INJECT();
				assert.notStrictEqual(201, res.statusCode);
				assert.strictEqual(409, res.statusCode);
			})
	})

	after(async() => await app.close());
})
