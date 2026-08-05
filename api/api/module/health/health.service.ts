import { Pool } from "pg";

export class HealthService{
	constructor(private db:Pool, private redis:any, private logger:any){
		this.db = db;
		this.redis = redis;
		this.logger = logger;
	}

	async PING(reqId:string){
		let dbConnection = null;
		let redisErr = null;
		let dbErr = null;
		try{
			await this.db.connect();
			await this.redis.connect();
			
			this.db.on('connect', () => {
				dbConnection = true;
			});
			this.db.on("error", (error:any) => {
				dbErr = error;
			})
			const reply = await this.redis.ping();
			this.redis.on("error", (error:any) => {
				redisErr = error; 
			})

			if(!reply && redisErr !== null) await this.logger.error({ title: "REDIS", error: redisErr  } , reqId);	
			if(dbConnection !== true && dbConnection !== null) await this.logger.error({ title: "DB", error:dbErr }, reqId);

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
