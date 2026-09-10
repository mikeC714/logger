import { test, beforeAll, afterAll, expect } from "bun:test";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { createDB } from "./test.utils.ts";
import { DB } from "../db.ts";

// instantiate and insert data within memory db
// delete all Bank keys

let database:any;
let db:DB;
let data = [
	"test_key_1",
	"test_key_2",
	"test_key_3",
	"test_key_4"
];

beforeAll(() => {
	database = createDB();	
	const inject = database.prepare("INSERT INTO bank (project_key) VALUES (?)");

	try{
		database.transaction(() => {
			for(const key of data){
				inject.run(key);
			}
		})()
	}catch(e){
		console.error(e)
		throw e;
	}finally{
		inject.finalize();
	};

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


test("Delete all keys from bank", () => {
	const res = db.deleteAllKeys();
	expect(res).toBe(true);
});
