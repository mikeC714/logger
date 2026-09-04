import type { Redis } from "ioredis";

export const WsHandlers = {
	 handleDisconnect: async(redis:Redis, projectKey:string) => {
		console.log("WS_HANDLERS", projectKey);
		try{
			console.log("DESTORYED");
			await redis.xgroup("DESTROY", `stream:${projectKey}`, `${projectKey}-grp`)
		}catch(e:any){
		}

		console.log("DELETED");
		await redis.del(`stream:${projectKey}`);
	},
}
