import fp from "fastify-plugin";
import { Server } from "socket.io";
import { WsHandlers } from "../../stream/ws/ws.handlers.ts";

function ws_plugin(fastify:any, opts:{}){
	const io = new Server(fastify.server, {
		connectionStateRecovery:{
			maxDisconnectionDuration: 20 * 60 * 1000,
			skipMiddlewares:true
		},
		...opts
	});	

	fastify.decorate("io",io);


	io.use((socket, next) => {
		const { key, projectKey } = socket.handshake.auth;
		if(key !== process.env.SOCKET_KEY || !projectKey){
			fastify.log.info(`Undisclosed socket attempted to connect. SOCKET:${socket}, TIME: ${Date.now()}`);
			socket.disconnect(true);
			return;
		};
		next();
	});

	io.on("connect", (socket) => {
		if(socket.recovered){
			fastify.log.info(`Socket:${socket} had a connection blip.`);
		}
		const { projectKey } = socket.handshake.auth;
		socket.join(projectKey);
		socket.on("disconnect", async() => await WsHandlers.handleDisconnect(fastify.redis, projectKey));
	});
	fastify.addHook('onClose', (done) => {
		//close client but connect to queue 
	})
}

export const SOCKET_PLUGIN = fp(ws_plugin);
