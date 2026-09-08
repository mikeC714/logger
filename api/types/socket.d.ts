import type { MSG_DATA } from "./msgData.d.ts";


export interface SOCKET_METHODS{
	writeToSocket(projectKey:string, batch:Array<MSG_DATA>):Promise<void>
}

