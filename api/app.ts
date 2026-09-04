import "dotenv/config";
import fastify from "fastify";
import { REDIS_PLUGIN } from "./api/plugins/redis.plugin.ts";
import { ERR_PLUGIN } from "./api/plugins/err.plugin.ts";
import { SOCKET_PLUGIN } from "./api/plugins/ws.plugin.ts";
// import { healthRoutes } from "./api/module/health/health.routes.ts";
import { logRoutes } from "./api/module/log/log.routes.ts"

export function build(opts={}){
	const app = fastify({ logger:true, ...opts });
	app.register(ERR_PLUGIN);
	app.register(SOCKET_PLUGIN);
	app.register(REDIS_PLUGIN, { timeout: 6000 });
	app.register(logRoutes, { prefix: "/api" });
	return app;
}
