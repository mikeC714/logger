import "dotenv/config";
import fastify from "fastify";
import fastifyRateLimit from "@fastify/rate-limit";
import { ERR_PLUGIN } from "./api/plugins/err.plugin.ts";
import { SOCKET_PLUGIN } from "./api/plugins/ws.plugin.ts";
import { CHECK_HEALTH_INTERVAL } from "./api/plugins/health.plugin.ts";
import { logRoutes } from "./api/module/log.routes.ts"
import { healthRoutes } from "./api/module/health.routes.ts";
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

			await sendLog(entry);
			process.stdout.write(entry + "\n");
		} catch (e) {
			process.stderr.write(`log error: ${String(e)}\n`);
		}
	},
};

export async function build(opts={}){
	const app = fastify({ logger:{ stream }, ...opts });
	await app.register(fastifyRateLimit, {
		max:100,
		timeWindow:"2 minutes"
	});
	app.register(ERR_PLUGIN);
	await app.register(SOCKET_PLUGIN);
	await app.register(CHECK_HEALTH_INTERVAL);
	await app.register(logRoutes, { prefix: "/api" });
	await app.register(healthRoutes, { prefix:"/api" })
	return app;
}
