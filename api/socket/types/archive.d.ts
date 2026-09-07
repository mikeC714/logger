import { Server } from "socket.io";
import { Redis } from "ioredis";
import { SOCKET_METHODS } from "./socket.js";


interface ARCHIVE_METHODS{
	checkStreamLength: (projectKey:string) => boolean;	
}

interface ARCHIVE_OPTIONS{
	projectKey?: string | undefined;
	socket: SOCKET_METHODS; 
	logger?: any;
	redis: Redis;
}


export { ARCHIVE_OPTIONS, ARCHIVE_METHODS };
