import fastify from "fastify";
import { DB_PLUGIN } from "./plugins/db/db.plugin.ts";
import { ERR_PLUGIN } from "./plugins/error/err.plugin.ts";
import { AUTH_ROUTER } from "./module/auth/auth.routes.ts";

export function build(opts={}){
	const app = fastify({ logger:true, ...opts });

	app.register(DB_PLUGIN);
	app.register(ERR_PLUGIN);
	app.register(AUTH_ROUTER);

	return app;
}
