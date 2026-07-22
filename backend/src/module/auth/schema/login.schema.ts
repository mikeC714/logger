export const login_schema = {
	body:{
		type:'object',
		required: ['username', 'passphrase'],
		properties: {
			username: { type: 'string', minLength: 1  },
			passphrase: { type: 'string', minLength: 8 }
		} 
	},
	response:{
		200: {
			type: 'string',
			properties: {
				ok: { type: 'boolean' },
				username: { type: 'string' },
			}
		}
	}
}


