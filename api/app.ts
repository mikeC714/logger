import "dotenv/config";
import fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";	
import { MAIN_DB_PLUGIN, REP_DB_PLUGIN } from "./api/plugins/db/db.plugin.ts";
import { ERR_PLUGIN } from "./api/plugins/error/err.plugin.ts";
import { SOCKET_PLUGIN } from "./stream/plugins.ts";

export function build(opts={}){
	const app = fastify({ logger:true, ...opts });
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
