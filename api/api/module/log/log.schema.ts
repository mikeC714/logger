export const LOG_SCHEMA = {
	description: "Log funnel from sdk to socket",
	tags:["log"],
	body:{
		type:"object",
		required:["projectKey", "log"],
		properties:{
			projectKey: { type:"string" },
			log:{ 
				type: "object",
				required:["lvl", "msg", "meta"],
				properties:{
					lvl:{ type:"string" },
					msg:{ type:"string" },
					meta:{
						type:"object",
						properties:{
							userId:{ type:"string" },
							username:{ type:"string" },
							role:{ type:"string" },
							enviroment:{ type:"string" },
							version:{ type:"string" },
							errorCode:{ type:"string" },
							errorStatus:{ type:"number" },
							timeStamp:{ type:"string" }
						}
					}
				}
			},

		}
	},
	response: {
		201: {
			type: "object",
			properties:{
				ok: { type: "boolean" },
			}
		},
	}
};
