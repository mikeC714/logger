import "dotenv/config";
import fastify from "fastify";
import fastifyRateLimit from "@fastify/rate-limit";
import { ERR_PLUGIN } from "./plugins/err.plugin.ts";
import { SOCKET_PLUGIN } from "./plugins/ws.plugin.ts";
import { CHECK_HEALTH_INTERVAL } from "./plugins/health.plugin.ts";
import { logRoutes } from "./module/log.routes.ts"
import { healthRoutes } from "./module/health.routes.ts";
import { sendLog } from "@tlog/lib";
import type { FastifyInstance } from "fastify";



// callback is used to be able to obtain the app instance 
// this is due to the once the stream is being instantiated app will most likely be undefined still testing this out
function createLogStream(getApp: () => FastifyInstance | undefined) {
	return {
		async write(msg: string) {
			try {
				const line = JSON.parse(msg);
				const entry = JSON.stringify({
					...line,
					time: new Date(line.time).toISOString().split("T").join(" "),
				});

				// const app = getApp();
				// if (app)  await sendLog(process.env.LOG_MACHINE!, process.env.APP_KEY!, entry, app);
				process.stdout.write(entry + "\n");
			} catch (e) {
				process.stderr.write(`log error: ${String(e)}\n`);
			}
		},
	};
}


export async function build(opts={}){
	let app:FastifyInstance | undefined;
	app = fastify({
		logger:{ 
			// instead of passing app to log stream
			// app is passed via callBack and is used whenever the createLogStream is needed
			stream: createLogStream(() => app) 
		}, ...opts 
	});
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
};
