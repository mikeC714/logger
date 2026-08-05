import "dotenv/config";
import fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";	
import fastifyRedis from "@fastify/redis";
import { MAIN_DB_PLUGIN, REP_DB_PLUGIN } from "./api/plugins/db.plugin.ts";
import { REDIS_PLUGIN } from "./api/plugins/redis.plugin.ts";
import { ERR_PLUGIN } from "./api/plugins/err.plugin.ts";
import { SOCKET_PLUGIN } from "./api/plugins/ws.plugin.ts";
import { healthRoutes } from "./api/module/health/health.routes.ts";
import { logRoutes } from "./api/module/log/log.routes.ts"

export function build(opts={}){
	const app = fastify({ logger:true, ...opts });
	app.register(SOCKET_PLUGIN);
	app.register(fastifyRedis,{ ...REDIS_PLUGIN })
	app.register(fastifyPostgres, { ...MAIN_DB_PLUGIN });
	app.register(fastifyPostgres, { ...REP_DB_PLUGIN });
	app.register(ERR_PLUGIN);
	app.register(healthRoutes);
	app.register(logRoutes);
	return app;
}
