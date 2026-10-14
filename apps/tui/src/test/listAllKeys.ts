import { test, beforeAll, afterAll, expect } from "bun:test";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { createDB } from "./utils/createDb.ts";
import { DB } from "../app/db.ts";
import { Log } from "../app/log.ts";

let database:any;
let db:DB;
let log:Log;
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
	log = new Log(db);
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


test("List all projectKeys within bank table returning Array<string> of the length of data", async()=> {
	await log.init();
	const res = log.list();
	expect(res.length).toEqual(data.length);
});
