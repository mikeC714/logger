import { test, beforeAll, afterAll, expect, expectTypeOf } from "bun:test";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { createDB, getLogs } from "./test.utils.ts";
import { DB } from "../db.ts";

// instantiate and insert data within memory db
// returning all logs based on the bank key

let database:any;
let db:DB;
let key = "test_key_1";
let logs:any;
let keys = [
	"test_key_1",
	"test_key_2",
	"test_key_3",
	"test_key_4"
];

beforeAll(() => {
	database = createDB();	
	const inject = database.prepare(`INSERT INTO bank (project_key) VALUES (?)`);
	const write = database.prepare(`INSERT INTO logs (project_key, level, msg, meta) VALUES (?,?,?,?)`);
	logs = getLogs();

	try{
		database.transaction(() => {
			for(const key of keys){
				inject.run(key);
			}			
			for(const log of logs.logs){
				write.run(logs.projectKey, log.lvl, log.msg, JSON.stringify(log.meta));
			}
		})();
	}catch(e){
		console.error(e)
		throw e;

	}finally{
		inject.finalize();
		write.finalize();
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


test("Fetch all logs based on the given projectKey", async() => {
	const res:any = await db.getAllLogs(key);
	for(const data of res){
		expect(data.project_key).toEqual(key);
	};
	expect(res);
});



