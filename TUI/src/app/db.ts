import { Database } from "bun:sqlite";
import type { MSG } from "../types/msgData.d.ts";


type USER = {
	user:string;
	newUser:string;
}
export class DB{
	private limit:number = 40;
	private db:Database;
	public user:string; 

	constructor(db:Database){
		this.db = db;
		this.user = "";
	}

	getUser = async(username:string) => {
		try{
			const row = this.db.query<USER, [string]>("SELECT user FROM boss WHERE user = ?").get(username);

			if(!row){
				return null;
			};
			if(!(await Bun.password.verify(username, row.user))) throw new Error("User not found");

			const { user } = row;

			this.user = user;
			return user;
		}catch(e){
			console.error(e);
			throw e;
		}		
	};

	createUser = async(user:string) => {
		try{
			const hash = await Bun.password.hash(user,{
				algorithm:"bcrypt",
				cost:10
			});

			const row = this.db.query<USER, {user:string}>("INSERT INTO boss (user) VALUES($user) RETURNING *").get({user: hash});
			
			if(!row) throw new Error("Failed to create user");

			return row;
		}catch(e){
			console.error(e);
			throw e;
		}
	};

	// CREATING
	// RECIEVING 
	// DELETING
	// ALL KEY RELATED
	create = (key:string, hash:string):boolean => {
		try{
			this.db.run("INSERT INTO bank (project_key, secret) VALUES (?, ?)", [key, hash]);
			return true
		}catch(e){
			console.log(e);
			throw e;	
		}
	};

	getAllKeysNSecrets = () => {
		try{
			return this.db.query("SELECT project_key, secret FROM bank").all() as Array<{project_key:string, secret:string}>;
		}catch(e){
			console.error("Failed to get log keys", e);	
		}
	};

	deleteKey = (key:string) => {
		try{
			this.db.run("DELETE FROM bank WHERE project_key = ?", [key]);
			return true;
		}catch(e){
			console.error("Failed to delete log", e);	
		}
	};

	deleteAllKeys = () => {
		try{
			this.db.query("DELETE FROM bank").run();
			return true;
		}catch(e){
		}
	}

	// RECIEVING 
	// DELETING
	// WRITTING
	// ALL LOG RELATED
	getPreviewLogs = async(key:string) => {
		try{
			const logs = this.db.query("SELECT * FROM logs WHERE project_key = ? ORDER BY rowid DESC LIMIT ?").all(key, this.limit);
			return logs.map((log:any) => ({
				...log,
				meta:JSON.parse(log.meta)
			}))
		}catch(e){
			console.error("Failed to fetch log to preview", e);	
		}
	};

	getAllLogs = async(key:string) => {
		try{
			const logs = this.db.query("SELECT * FROM logs WHERE project_key = ?").all(key);
			return logs.map((log:any) => ({
				...log,
				meta: JSON.parse(log.meta)
			}));
		}catch(e){
			console.error("Failed to fetch log", e);	
		}
	};

	getWarnAndErrorCount = async(key:string) => {
		try{
			const query = this.db.query<{ count:number }, [string, string]>("SELECT COUNT(*) AS count FROM logs WHERE project_key = ? AND level = ?");

			const warnings = query.get(key, "warn");
			const errors = query.get(key, "error")
			const fatals = query.get(key, "fatal");
			return{
				warn:warnings?.count ?? 0,
				error:errors?.count ?? 0,
				fatal:fatals?.count ?? 0
			} 

		}catch(e){
			console.error("Failed to fetch warn and error count.", e);
		}
	}

	write = async(key:string, logs:Array<MSG>):Promise<boolean> => {
		const queryInsert = this.db.prepare("INSERT INTO logs (project_key, level, msg, meta) VALUES (?,?,?,?)");
		try{

			this.db.transaction(() => {
				for(const log of logs){
					queryInsert.run(
						key,
						log.lvl,
						log.msg,
						JSON.stringify(log.meta)
					);
				}
			})();

			return true;
		}catch(e){
			console.error("FAILURE:", e);
			throw e;
		}finally{
			queryInsert.finalize();
		}
	};

	getLogsUsingQuery = async(projectKey:string, query:string) => {
		try{
			return this.db.query(`SELECT * FROM logs WHERE project_key = ? AND (created_at LIKE ? OR level LIKE ?)`).all(projectKey, query, query);
		}catch(e){
			throw e;
		}
	}

	// ENTRY MONITORING
	private getEntryCount = async(key:string) => {
		try{
			return this.db.query(`SELECT COUNT(*) as count FROM logs WHERE project_key = $project_key`).get({ $project_key: key }) as { count:number };
		}catch(e){
			throw e;
		}
	}
};


