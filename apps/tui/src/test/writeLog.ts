import { test, beforeAll, afterAll, expect, expectTypeOf } from "bun:test";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { createDB } from "./utils/createDb.ts";
import { logs } from "./utils/logs.ts";
import { DB } from "../app/db.ts";

// instantiate and insert data within memory db
// returning all logs based on the bank key

let database:any;
let db:DB;

let data = "test_key_1";

beforeAll(() => {
	database = createDB();	
	try{
		database.run(`INSERT INTO bank(project_key) VALUES(?)`, [data]);
	}catch(e){
		console.error(e)
		throw e;

	}
	db = new DB(database);
});

afterAll(() => {
	const dirname = import.meta.dirname;
	const path = join(dirname, ":memory");

	try{
		database.close(true);
		rmSync(path, { force:true });
	}catch(e){
		console.error(e)
		throw e;
	}
});


test("Fetch all logs based on the given projectKey", async() => {
	const res:any = await db.write(data, logs);
	expect(res).toEqual(true);
});



