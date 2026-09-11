import { Database } from "bun:sqlite";

// NEED TO FIGURE OUT HOW TO DETERMINE THE PATH
// BEFORE CREATING THE DB INSTANCE:
// CHECK IF THE PATH DIR WAS INSTANTIATED (existsSync)
export const db = new Database("", {
	strict:true,
	create:true,
	readwrite:true
});

export function initDB(){
	db.run("PRAGMA foreign_keys = ON")
	db.run(`
		   CREATE TABLE IF NOT EXISTS bank(
				project_key TEXT PRIMARY KEY,
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
   db.run(`
		  CREATE INDEX idx_logs_level ON logs(level)
  `);
   db.run(`
		  CREATE INDEX idx_project_key ON logs(project_key)
  `);
};




