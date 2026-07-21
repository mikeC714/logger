import { Pool } from "pg";
import type { RedisClientType } from "redis";
import { LoggerService } from "../services/log.service.ts";
const logger = new LoggerService();

export class Health{
	constructor(private db:Pool, private redis:RedisClientType){
		if(!db) throw new Error("Failed to provide a db.");
		if(!redis) throw new Error("Failed to provide a RedisClient.");
	}

	async PING(req_id:string){
		let dbConnection = null;
		let redisErr = null;
		let dbErr = null;
		try{
			await this.db.connect();
			await this.redis.connect();
			
			this.db.on('connection', () => {
				dbConnection = true;
			});
			this.db.on("error", (error:any) => {
				dbErr = error;
			})
			const reply = await this.redis.ping();
			this.redis.on("error", (error:any) => {
				redisErr = error; 
			})

			if(!reply && redisErr !== null) await logger.log_err({ title: "REDIS", error: redisErr  } , req_id);	
			if(dbConnection !== true && dbConnection !== null) await logger.log_err({ title: "DB", error:dbErr }, req_id);

			return {
				dbConnection,
				redisConnection: reply === "PONG" ? true : null,
				status: dbConnection === true && reply === "PONG" ? "HEALTHY":"NOT GOOD",
				timestamp: Date.now(),
			}
		}catch(err){ 
			throw err
		}
	}
}
