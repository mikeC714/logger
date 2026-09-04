import { io } from "socket.io-client";

const log = [
	"TESTING_LOG_STREAM",
	[
		{ lvl:"info", msg:"Testing socket", meta:{} },
		{ lvl:"fatal", msg:"Payment Failure", meta:{} },
		{ lvl:"warn", msg:"Be Careful", meta:{} },
		{ lvl:"error", msg:"Payment crash", meta:{} },
		{ lvl:"debug", msg:"Testing ", meta:{} },
		{ lvl:"warn", msg:"Invalid Credentials", meta:{} },
		{ lvl:"fatal", msg:"Payment Failure", meta:{} },
		{ lvl:"error", msg:"Payment Crash", meta:{} },
		{ lvl:"fatal", msg:"Server Down", meta:{} },
		{ lvl:"warn", msg:"Invalid User", meta:{} },
		{ lvl:"error", msg:"Socket Crash", meta:{} },
		{ lvl:"fatal", msg:"Server Down", meta:{} },
		{ lvl:"fatal", msg:"Server Down", meta:{} },
		{ lvl:"fatal", msg:"Server Down", meta:{} },
		{ lvl:"fatal", msg:"Redis Down", meta:{} },
		{ lvl:"error", msg:"Socket Disconnect", meta:{} },
		{ lvl:"info", msg:"Server Online", meta:{} },
		{ lvl:"info", msg:"Socket Online", meta:{} },
		{ lvl:"info", msg:"Socket Online", meta:{} },
		{ lvl:"info", msg:"Socket Online", meta:{} },
	]
]; 

const buildSocket = (override?:any) => {
	return new Promise((res, rej) => {
		const socket = io(process.env.SERVER,{
			auth:{
				...override,
				projectKey:"TESTING_LOG_STREAM",
				key:process.env.SOCKET_KEY	
			},
			reconnection:true,
			reconnectionAttempts:3,
			reconnectionDelay:1000,
		});	
		const timeout = setTimeout(() => {
			rej(new Error("Socket Connection Failed"));
		}, 5000);

		socket.on("connect", () => {
			clearTimeout(timeout);
			res(socket);
		});
		socket.on("connection_error", (err) => {
			clearTimeout(timeout);
			rej(new Error(`Failed to connect: ${err}`));
		});
		socket.on("msg", (fn:(ack:boolean) => boolean) => {
			fn(true);
		});
		socket.on("ackedMsg", (msg) => {
			console.log("MSG",msg)
		});
	});
};

const LOG = (overrides?:any) => {
	return [
		...overrides,
		...log
	]
}


export { buildSocket, LOG, log };
