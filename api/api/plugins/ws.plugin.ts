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
	
	let connectionStatus:boolean = false;

	io.use((socket, next) => {
		const { key } = socket.handshake.auth;
		console.log("SOCKET KEY", key);
		if(key !== process.env.SOCKET_KEY){
			fastify.log.info(`Undisclosed socket attempted to connect. SOCKET:${socket}, TIME: ${Date.now()}`);
			socket.disconnect(true);
			return;
		};
		next();
	});

	io.on("connect", (socket) => {
		connectionStatus = true;
		if(socket.recovered){
			fastify.log.info(`Socket:${socket} had a connection blip.`);
		}
		const { projectKey } = socket.handshake.auth;
		socket.join(projectKey);
		socket.on("disconnect", async(reason):Promise<void> => {
			console.log(reason);
			await WsHandlers.handleDisconnect(fastify.redis, projectKey)
		});
		io.emit("connected", connectionStatus)
	});

	io.on("connection_error", (err) => {
		if(err){
			//retry to connect
		}
		// disconnect
		// return err 
	})

	fastify.addHook('onClose', (done) => {
		//close client but connect to queue 
	})
}

export const SOCKET_PLUGIN = fp(ws_plugin);
