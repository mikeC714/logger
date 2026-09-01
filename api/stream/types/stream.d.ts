import { Redis } from "ioredis";
import { Server }  from "socket.io";
import type { ARCHIVE_OPTIONS } from "./archive";
import type { SOCKET_METHODS } from "./socket";

export interface STREAM_OPTIONS {
	projectKey?:string;
	socket?: Server | undefined;
	socketMethods?: SOCKET_METHODS;
	redis?:Redis;
	archive?: ARCHIVE_OPTIONS
}
