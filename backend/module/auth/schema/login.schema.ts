export const login_schema = {
	body:{
		type:'object',
		required: ['username', 'passphrase'],
		properties: {
			username: { type: 'string', minLenght: 1  },
			passphrase: { type: 'string', minLength: 8 }
		} 
	},
	response:{
		200: {
			type: 'string',
			properties: {
				username: { type: 'string' },
				logs: { type: Array<Array<Buffer>> }
			}
		}
	}
}


