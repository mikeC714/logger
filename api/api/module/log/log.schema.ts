export const LOG_SCHEMA = {
	body:{
		type: "array",
		prefix:[
			{ type: "string" },
			{
				type:"array",
				items:{
					type:"object",
					required:["lvl", "msg", "meta"],
					properties:{
						lvl: { type:"string" },
						msg:{ type:"string" },
						meta:{ type:"object" }
					},
					additionalProperties:false
				}
			}
		],
		items:false,
		minItems:2
	}	
};
