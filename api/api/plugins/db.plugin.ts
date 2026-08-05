const MAIN_DB_PLUGIN = {
	connectionString: process.env.DB_CONNECTION,
	name:"main",
	max:2,
	connectionTimeoutMillis: 5000
}

const REP_DB_PLUGIN = {
	connectionString: process.env.REP_DB_CONNECTION,
	name:"rep",
	max:2,
	connectionMillis:8000
}

export { REP_DB_PLUGIN, MAIN_DB_PLUGIN };	
