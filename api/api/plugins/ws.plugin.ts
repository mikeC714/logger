import fp from "fastify-plugin";
import { Server } from "socket.io";

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
		const { projectKey, key } = socket.handshake.auth;
		if(key !== process.env.SOCKET_KEY || !projectKey){
			fastify.log.warn(`Undisclosed socket attempted to connect. SOCKET:${socket}, TIME: ${Date.now()}`);
			socket.disconnect(true);
			return;
		};
		next();
	});

	io.on("connect", (socket) => {
		const { projectKey, key } = socket.handshake.auth;
		if(!key){
			socket.disconnect(true);
			return;
		};
	
		fastify.log.info(`Socket: ${socket.id} connected to project: ${key}`);

		socket.emit("connected", true);
		socket.on("join_room", async(pKey:string, fn:(ack:{ ok:boolean, key:string })=>void) => {

			try{
				await socket.join(pKey);

				fastify.log.info(`Socket:${socket.id} joined room: ${pKey}`);

				fn({ ok:true, key:pKey });
			}catch(e:any){
				fastify.log.error(`Join failed for:${socket.id}, ${e}`);
				fn({ ok:false, key:projectKey });
			}	
		})

		socket.on("disconnect", async(reason:any):Promise<void> => {
			fastify.log.info(`Socket:${socket.id} disconnected:${reason}`);
			socket.leave(projectKey);
		})
	});


	io.on("connection_error", (err) => {
		if(err){
			//retry to connect
		}
		// disconnect
		// return err 
	})

	fastify.addHook('onClose', (done:boolean) => {
		//close client but connect to queue 
	})
}

export const SOCKET_PLUGIN = fp(ws_plugin);
