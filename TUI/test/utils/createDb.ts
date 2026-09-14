import { Database } from "bun:sqlite";

export function createDB():Database{
	try{
		const db = new Database(":memory", { strict:true, create:true, readwrite:true });
		db.run("PRAGMA foreign_keys = ON")
		db.run(`
			   CREATE TABLE IF NOT EXISTS bank(
					project_key TEXT PRIMARY KEY,
					secret TEXT NOT NULL,
					created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
				)`
			  );
		db.run(`
		   CREATE TABLE IF NOT EXISTS logs (
			   id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
			   project_key TEXT,
			   level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error', 'fatal', 'debug')),
			   msg TEXT,
			   meta TEXT,
			   created_at INTEGER NOT NULL DEFAULT (unixepoch()),
			   FOREIGN KEY (project_key) REFERENCES bank(project_key) ON DELETE CASCADE
		   )`		
		);
	  return db;
	}catch(e){
		console.error(e);
		throw e;
	}
}
