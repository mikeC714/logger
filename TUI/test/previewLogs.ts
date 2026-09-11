import { test, beforeAll, afterAll, expect, expectTypeOf } from "bun:test";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { createDB, getLogs } from "./test.utils.ts";
import { DB } from "../db.ts";

// instantiate and insert data within memory db
// call DB method preview log based on the bank key
// returning the recent 40 entries

let database:any;
let db:DB;

let data = "test_key_1";
let logs:any;

beforeAll(() => {
	database = createDB();	
	const write = database.prepare(`INSERT INTO logs (project_key, level, msg, meta) VALUES (?,?,?,?)`);
	try{
		database.run(`INSERT INTO bank (project_key) VALUES(?)`, [data]);
		database.transaction(() => {
			for(const log of logs.logs){
				write.run(logs.projectKey, log.lvl, log.msg, JSON.stringify(log.meta));
			}
		})();
	}catch(e){
		console.error(e)
		throw e;

	}finally{
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


test("Fetch log preview. The length limit should be 40", async() => {
	const res:any = await db.getPreviewLogs(logs.projectKey);
	expect(res.length).toEqual(40);
});



