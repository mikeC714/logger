import { test, afterEach, describe, it, before, after } from "node:test";
import { LoggerService, STREAM } from "../../../module/log/log.service.ts";
import type { LOG } from "../../../types/log.d.ts";
import assert from "node:assert";
import Redis from "ioredis";

const redis = new Redis({
	port:process.env.REDIS_PORT as string,
	host:process.env.REDIS_HOST,
	username:process.env.REDIS_USERNAME,
	password:process.env.REDIS_PASSWORD,
	retryStrategy: (times:number) =>{
		const delay = Math.min(times * 10, 2000);
		return delay;
	},
})

const obj:LOG = ({ username:"Joe", logId:"123", logName:"prod1"})
let log = new LoggerService(obj, redis)


before(async() => {
	await redis.connect({  });
})

after(async() => {
	await redis.disconnect();
})







