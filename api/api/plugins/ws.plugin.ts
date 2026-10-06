import fp from "fastify-plugin";
import { date } from "../../utils/date.ts";
import { Server } from "socket.io";
import type { FastifyInstance } from "fastify";


function ws_plugin(fastify:any, opts:{}){
	const io = new Server(fastify.server, {
		cors:{ methods:["POST"] },
		connectionStateRecovery:{
			maxDisconnectionDuration: 20 * 60 * 1000,
			skipMiddlewares:true
		},
		...opts
	});	

	fastify.decorate("io",io);
	
	io.use((socket, next) => {
		const { userKey, key } = socket.handshake.auth;
		if(key !== process.env.SOCKET_KEY || !userKey){
			fastify.log.warn(`${date} Undisclosed socket attempted to connect. socket:${userKey}`);
			socket.disconnect(true);
			return;
		};
		next();
	});

	io.on("connect", async(socket:any) => {
		const { userKey } = socket.handshake.auth;
		socket.user = userKey;

		// sockets can buffer connection
		// with socket.io it handles auto reconnect for you
		// but if the socket wasn't able to reconnect within a specific time period (configured on the client side)
		// a new room session is instantiated
		if(!socket.recovered){
			await joinRoom(socket, fastify);
		}

		fastify.log.info(`${date} Socket: ${socket.id} connected to server`);

		socket.emit("connected", true);

		// check if there is a room with the given projectKey
		// if not create one
		// if there is continue
		if(!socket.rooms.has(userKey)){
			await joinRoom(socket, fastify)
		} 

		socket.on("disconnect", async(reason:any):Promise<void> => {
			fastify.log.info(`Socket:${socket.id} disconnected:${reason}`);
			socket.leave(userKey);
		})
	});


	io.on("connection_error", (err) => {
		if(err){
			//retry to connect
		}
		// disconnect
		// return err 
	})
}

async function joinRoom(clientSocket:any, fastify:FastifyInstance){
	try{
		await clientSocket.join(clientSocket.user)
		fastify.log.info(`Socket:${clientSocket.id} joined room: ${clientSocket.user}`);
	}catch(e:Error | any){
		fastify.log.error(`Join failed for:${clientSocket.id}, ${e.message}`);
	}
}

export const SOCKET_PLUGIN = fp(ws_plugin);
