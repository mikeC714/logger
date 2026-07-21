export const signup_schema = {
	body:{
		type:"object",
		required:["username", "passphrase"], 
		properties:{
			username: { type: "string", minLength: 1 },
			passphrase: { type: "string", minLenght: 8 }	
		}	
	},
	response:{
		201: {
			type: 'string',
			properties: {
				username: { type: 'string' }
			}
		}
	}
}
