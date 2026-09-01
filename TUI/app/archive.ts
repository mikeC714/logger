import type {SOCKET_DATA} from "./types/socket.d.ts";
import { io } from "socket.io-client";
import path from "node:path";


export class ArchiveService {
	private dir = __dirname;
	public socket:any | typeof io;
	private batchLimit:number = 100;
	private batch:Array<string> = [];

	constructor(socket:typeof io){
		this.socket = socket;
	}

	recievedMsg = async() => {
		this.socket.off("archive");
		this.socket.on("archive", (ackCallback: (res:string) => void) => {
			ackCallback("recieved");
		});
		this.socket.on("archiveMsg", (data:SOCKET_DATA) => { 
			this.processMsg(data);
		})
	};
					  
	async *iter(msgData:SOCKET_DATA["logs"]):AsyncGenerator<Array<string>>{
		const HEADERS = ["LEVEL", "MSG", "DATE"];
		yield HEADERS;
		// ITERATE 100_000 ENTRIES
		for(const [_,logs] of Object.entries(msgData)){
			for(const [msgId,logData] of Object.entries(logs)){
				const date = new Date().toISOString().replace("T", "  ").replace(/\..+/, "");
					// push entry into state 
					// stringify 
					// [msgID:string, logData:object, date:string] 
					// check if limit is met 
					// yeild batch then clear for the next iteration 
					this.batch.push(JSON.stringify([msgId, logData, date]) + "\n");
					if(this.batch.length >= this.batchLimit){
						yield this.batch;	
						this.batch = [];
				}
			}
		};
		// clean up batch if there are straglers 
		if(this.batch.length > 0) yield this.batch;
	};

	processMsg = async(msgData:SOCKET_DATA):Promise<any> => {
		try{
			// const target = path.join(this.dir, "logs", `${msgData.projectKey}.tar.gz`);
			const filePath = path.join(this.dir, "logs", `${msgData.projectKey}.csv`);
			const file = Bun.file(filePath);
			const compressPath = path.join(this.dir, "logs", `${msgData.projectKey}.csv.gz`);
			const compressFile = Bun.file(compressPath);

			// iterate over chunks to obtain individual chuks within batch 
			// write each chunk of chunk
			for await(const chunks of this.iter(msgData.logs)){
				for(const chunk of chunks){
					file.writer().write(Buffer.from(chunk));	
				}
			}
			// close file once finished
			await file.writer().end();
			
			// compress 
			const compressedStream = file.stream().pipeThrough(new CompressionStream("gzip"));
			// write to new compress file pipeing it throw compress stream
			await Bun.write(compressFile, new Response(compressedStream));

			// delete uncompressed file once compression is finished 
			await file.delete();
		}catch(err){
			throw err;
		}
	};

	readArchivedFile = async(projectKey:string):Promise<void> => {
		let batch = [];
		try{
			// TODO
			// get path
			// obtain file with the path
			// decompress the file
			// iterate over file to obtain the file data
			// return the data either in batches until complete or entirely


			//get path
			const target = path.join(this.dir, "logs", `${projectKey}.tar.gz`);
			const file = Bun.file(target).stream();

			//decompress
			const decompressedFile = file.pipeThrough(new DecompressionStream("gzip"));

			//iterate over decompressedFile to obtain the data
			for await(const data of decompressedFile){
			};
		}catch(err){
			throw err;
		}	
	};
}
