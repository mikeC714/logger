export function testFunc(database:any, getLogs:any){
	const write = database.prepare(`INSERT INTO logs (project_key, level, msg, meta) VALUES (?,?,?,?)`);

	const projectKey = "test_key_1";
	const logs = getLogs();
	const hash = Bun.SHA256.hash(projectKey, "hex");

	try{
		database.run("INSERT INTO bank (project_key, secret) VALUES(?, ?)", [projectKey, hash]);
		database.transaction(() => {
			for(const log of logs.logs){
				write.run(logs.projectKey, log.lvl, log.msg, JSON.stringify(log.meta));
			}
		})();
	}catch(e){
		console.error(e)
		throw e;

	}finally{
		write.finalize();
	};
};
