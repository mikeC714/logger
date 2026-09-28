import "dotenv/config";
import fastify from "fastify";
import { ERR_PLUGIN } from "./api/plugins/err.plugin.ts";
import { SOCKET_PLUGIN } from "./api/plugins/ws.plugin.ts";
import { logRoutes } from "./api/module/log.routes.ts"

export async function build(opts={}){
	const app = fastify({ logger:true, ...opts });
	app.register(ERR_PLUGIN);
	await app.register(SOCKET_PLUGIN);
	await app.register(logRoutes, { prefix: "/api" });
	return app;
}
