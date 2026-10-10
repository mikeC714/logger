import { beforeAll, afterAll, test, expect } from "bun:test";
import { createDB } from "./utils/createDb.ts";
import { DB } from "../app/db.ts";
import { userInfo } from "node:os";

// Instantiate a memory based sqlite db;
// then it should call DB class method create
// creating new Bank
// returning true indicating that the creation was a success


let database:any;
let db:DB; 

beforeAll(async() => {
	database = createDB();
	db = new DB(database);
});

afterAll(async() => {

	await database.close(true);
});

test("Fetch user", async() => {
	try{
		const username = userInfo().username;
		const newUser = await db.createUser(username);
		console.log(newUser);
	}catch(e){
		console.error(e)
	}
});

