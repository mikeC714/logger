import type { Redis } from "ioredis";
import type { ARCHIVE_OPTIONS } from "./types/archive.d.ts";
import type { SOCKET_METHODS } from "./types/socket.d.ts";

export class Archive{
	private log_limit:number = 100_000;
	socket: SOCKET_METHODS;
	logger?:any = null;
	redis: Redis;
	constructor(options: ARCHIVE_OPTIONS){
		this.socket = options.socket;
		this.logger = options.logger;
		this.redis = options.redis;
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
					"MINID", "~", lastId,
					'LIMIT', this.log_limit	
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
				projectKey, "-", lastId,
				"COUNT", this.log_limit 
			);
			return data;
		}catch(err){
			throw err;
		}
	}
}
