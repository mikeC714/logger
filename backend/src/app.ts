import "dotenv/config";
import fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";	
import { MAIN_DB_PLUGIN, REP_DB_PLUGIN } from "./plugins/db/db.plugin.ts";
import { ERR_PLUGIN } from "./plugins/error/err.plugin.ts";
import { AUTH_ROUTER } from "./module/auth/auth.routes.ts";

export function build(opts={}){
	const app = fastify({ logger:true, ...opts });
	app.register(fastifyPostgres, {
		...MAIN_DB_PLUGIN
	});
	app.register(fastifyPostgres, {
		...REP_DB_PLUGIN
	});
	app.register(ERR_PLUGIN);
	app.register(AUTH_ROUTER, { prefix: "/api" });
	return app;
}
