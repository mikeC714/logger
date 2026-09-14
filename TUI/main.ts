import { buildTUI } from "./interface/main.ts";
import { initDB } from "./config/db.config.ts";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";

function MAIN(){
	initDB();
	buildTUI();
	process.on("SIGINT", () => {
		buildTUI(true);
		process.exit(0);
	});
};
MAIN();
