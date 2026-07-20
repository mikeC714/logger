import { Pool } from "pg";
import { RedisClientType } from "ioredis";
import { Logger } from "../services/log.service.ts";
const logger = new Logger;

export class Health{
	constructor(private db:Pool, private redis:RedisClientType){
		if(!db) throw new Error("Failed to provide a db.");
		if(!RedisClientType) throw new Error("Failed to provide a RedisClient.");
	}

	async PING(){
		let dbConnection = null;
		let redisErr = null;
		let dbErr = null;
		try{
			await this.db.connect();
			await this.redis.connect();
			
			this.db.on('connection', () =>{
				dbConnection = true;
			});
			this.db.on("error", (error:any) => {
				dbErr = error;
			})
			const reply = await this.redis.ping();
			this.redis.on("error", (error:any) => {
				redisErr = error; 
			})

			if(!reply && redisErr !== null) await logger.log(JSON.stringify({ title: "REDIS", redisErr }));	
			if(dbConnection !== true && dbConnection !== null) await logger.log(JSON.stringify({ title: "DB", dbErr }));

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
