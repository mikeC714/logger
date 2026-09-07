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

const buildSocket = (url:any, override?:any, fn?:any) => {
	const projectKey = "TESTING_LOG_STREAM";
	return new Promise((res, rej) => {
		const socket = io(url,{
			auth:{
				projectKey,
				...override,
				key:process.env.SOCKET_KEY	
			},
			reconnection:true,
			reconnectionAttempts:3,
			reconnectionDelay:1000,
		});	
		const timeout = setTimeout(() => {
			rej(new Error("Socket Connection Failed"));
		}, 5000);

		socket.on("connect", () =>{ 
			clearTimeout(timeout);
		})

		socket.on("connected", (ok:boolean) => {
			if(!ok) return;

			socket.emit("join_room", projectKey, (ack:{ok:boolean, key:string}) => {
				if(ack.ok){
					console.log("ROOM CREATED:", ack.ok, ack.key); 
					res(socket);
				}else{
					rej(new Error("Failed to join the project room"));	
				};
			});
		})

		socket.on("msg", (data) => {
			console.log("MSGDATA",data)
		});

		socket.on("connection_error", (err) => {
			clearTimeout(timeout);
			rej(new Error(`Failed to connect: ${err}`));
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
