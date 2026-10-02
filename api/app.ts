import "dotenv/config";
import fastify from "fastify";
import { ERR_PLUGIN } from "./api/plugins/err.plugin.ts";
import { SOCKET_PLUGIN } from "./api/plugins/ws.plugin.ts";
import { logRoutes } from "./api/module/log.routes.ts"
import { sendLog } from "./lib/sendLog.ts";
import type { SERVER_LOG } from "./types/log.d.ts";



const stream = {
	async write(msg: string) {
		try {
			const line: SERVER_LOG = JSON.parse(msg);
			const entry = JSON.stringify({
			  ...line,
			  time: new Date(line.time).toISOString().split("T").join(" "),
			});


			// TODO //
			//////////
			//
			// uncomment when server is configured
			//
			// await sendLog(entry);


			process.stdout.write(entry + "\n");
		} catch (e) {
			process.stderr.write(`log error: ${String(e)}\n`);
		}
	},
};

export async function build(opts={}){
	const app = fastify({ logger:{ stream }, ...opts });
	app.register(ERR_PLUGIN);
	await app.register(SOCKET_PLUGIN);
	await app.register(logRoutes, { prefix: "/api" });
	return app;
}
