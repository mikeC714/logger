import { Database } from "bun:sqlite";

// NEED TO FIGURE OUT HOW TO DETERMINE THE PATH
// BEFORE CREATING THE DB INSTANCE:
// CHECK IF THE PATH DIR WAS INSTANTIATED (existsSync)
export async function initDB(){
	const db = new Database(":memory:", {
		strict:true,
		create:true,
		readwrite:true
	});

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
		   level TEXT NOT NULL CHECK (level IN ('info', 'good', 'warn', 'error', 'fatal', 'debug')),
		   msg TEXT,
		   meta TEXT,
		   created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
		   FOREIGN KEY (project_key) REFERENCES bank(project_key) ON DELETE CASCADE
	   )`		
	);
	db.run(` CREATE INDEX IF NOT EXISTS idx_log_project_key ON logs(project_key) `);

	db.run(` CREATE INDEX IF NOT EXISTS idx_log_timestamp ON logs(project_key, timestamp)`)
	db.run(` CREATE INDEX IF NOT EXISTS idx_log_all_timestamp ON logs(timestamp)`)

	db.run(` CREATE INDEX IF NOT EXISTS idx_log_level ON logs(project_key, level)`)
  	db.run(` CREATE INDEX IF NOT EXISTS idx_log_all_level ON logs(level)`)

  return db;
};




