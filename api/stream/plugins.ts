import fp from "fastify-plugin";
import { Server } from "socket.io";


function ws_plugin(fastify:any, opts:{}){
	const io = new Server(fastify.server, opts);	

	fastify.decorate("io",io);

	fastify.addHook('onClose', (done) => {
		//close client but connect to queue 
	})
}

export const SOCKET_PLUGIN = fp(ws_plugin);
