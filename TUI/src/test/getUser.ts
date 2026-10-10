import { beforeAll, afterAll, test, expect } from "bun:test";
import { createDB } from "./utils/createDb.ts";
import { DB } from "../app/db.ts";

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

test("Fetch user", () => {
	try{
	}catch(e){
		console.error(e)
	}
});

