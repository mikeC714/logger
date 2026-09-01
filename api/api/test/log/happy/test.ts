import {before, after, test} from "node:test";
import request from "supertest";
import assert from "node:assert";
import { build } from "../../../../app.ts";
import { io } from "socket.io-client";
import { Logger } from "../../../../sdk/index.ts";

const logger = new Logger({
	projectKey:"test_123"
});

const app:any = await build()
await app.ready();
const req = request(app);


const INJECT = (data:object) => {
	const res = req
				.post("/api/log")
				.set("Content-type", "application/json")
				.send(data)
	return res;
};



test("POST /api/log", async() => {
	const res = INJECT({lvl: "info", msg: "log api", meta: {}})
	console.log(res);
})

test("POST log", async() => {
	const res = await logger.log({ lvl:"info", msg:"log is working", meta:{} })
	assert.strictEqual(res, true);
});



