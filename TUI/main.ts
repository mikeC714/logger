import { Socket } from "./config/socket.config.ts";
import { buildTUI } from "./interface/main.ts";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";

function MAIN(){
	Socket();
	buildTUI();
	process.on("SIGINT", () => {
		buildTUI(true)
		process.exit(0);
	});
};
MAIN();
