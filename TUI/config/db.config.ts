import { Database } from "bun:sqlite";

// NEED TO FIGURE OUT HOW TO DETERMINE THE PATH
// BEFORE CREATING THE DB INSTANCE:
// CHECK IF THE PATH DIR WAS INSTANTIATED (existsSync)
export const db = new Database("pathToAppDir", {
	strict:true,
	create:true,
	readwrite:true
});

db.run(`
	CREATE TABLE IF NOT EXISITS logs (
		id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
		project_key TEXT NOT NULL,
		level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error', 'fatal', 'debug')),
		msg TEXT,
		meta TEXT,
		created_at INTEGER NOT NULL DEFAULT (unixepoch())
	)		
`);

db.run(`
	   CREATE INDEX idx_logs_level ON logs(level)
`);





