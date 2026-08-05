import "dotenv/config";
import fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";	
import { healthRoutes } from "./api/module/health/health.routes.ts";
import { MAIN_DB_PLUGIN, REP_DB_PLUGIN } from "./api/plugins/db.plugin.ts";
import { ERR_PLUGIN } from "./api/plugins/err.plugin.ts";
import { SOCKET_PLUGIN } from "./api/plugins/ws.plugin.ts";

export function build(opts={}){
	const app = fastify({ logger:true, ...opts });
	app.register(healthRoutes)
	app.register(SOCKET_PLUGIN);
	app.register(fastifyPostgres, {
		...MAIN_DB_PLUGIN
	});
	app.register(fastifyPostgres, {
		...REP_DB_PLUGIN
	});
	app.register(ERR_PLUGIN);
	return app;
}
