import { Redis } from "ioredis";

export class Archive{
	private log_limit:number = 8_000;
	socket:any = null;
	stream:any = null;
	logger:any = null;
	redis:Redis;
	constructor(stream:any, logger:any, redis:Redis, socket:any){
		this.stream = stream;
		this.socket = socket;
		this.logger = logger;
		this.redis = redis;
	}

	 public checkStreamLength = async(projectKey:string) =>{
		let limitReached:boolean = false; 
		try{
			const info:any = await this.redis.xinfo("STREAM",projectKey);
			const len:number = info[info.indexOf("length") +1];
			const lastId:string = info[info.indexOf("last-generated-id") +1];
			// const lastEntry:number = info[info.indexOf("last-entry") +1];

			if(len >= this.log_limit){
				limitReached = true;
				const data = await this.readFromStream(projectKey);
				await this.socket.writeToSocket(projectKey, data, "archive");
				await this.redis.xtrim(
					projectKey,
					"MINID",
					"~", 
					lastId,
					'LIMIT',
					"8000"
				);
			};
			return limitReached;
		}catch(err){
			throw err;
		}
	};	

	private readFromStream = async(projectKey:string):Promise<any> => {
		try{
			const info:any = await this.redis.xinfo("STREAM",projectKey);
			const lastId:string = info[info.indexOf("last-generated-id") +1];

			const data = await this.redis.xrange(
				projectKey,
				"-",
				lastId,
				"COUNT",
				8000
			);
			return data;
		}catch(err){
			throw err;
		}
	}
}
