export const healthSchema = {
	description: "What is expected to come from the health request",
	headers:{
		type:"object",
		required:["x-machine-key"],
		properties:{
			"x-machine-key":{ type: "string" }
		},
	},
	response:{
		200:{
			type:"object",
			properties:{
				ok:{ type:"boolean" },
				date:{ type:"string" }
			}
		}
	}
}
