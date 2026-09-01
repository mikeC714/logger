import type { MSG_DATA } from "./msgData.d.ts";
import type { JSON } from "./json.d.ts";

export type SOCKET_DATA = JSON<[ 
	ack:string,
	data:MSG_DATA
]>;

