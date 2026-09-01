export interface SOCKET_METHODS{
	writeToSocket(projectKey:string, log:{id:string, chunks:{}}, type:string):Promise<void>
}

