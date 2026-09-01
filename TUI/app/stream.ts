import { Folder } from "./folder.ts";
import type { MSG_DATA, MSG } from "../types/msgData.d.ts"; 

export class Stream extends Folder{
	private decode = new TextDecoder("utf-8");
	private ROTATE_THRESHOLD:number = 100_000; 
	private ENTRY_COUNTS:Map<string, number> = new Map();  

	constructor(){
		super();
	};
	
	 public msg = (msgData:MSG_DATA) => {
		this.process(msgData);
	};

	private async *iter(msgData:MSG_DATA):AsyncGenerator<Buffer>{
		const HEADERS = ["LEVEL", "MSG", "DATE"];
		yield Buffer.from(HEADERS.join("   ") + "\n");
		yield Buffer.from(`PROJECTKEY: ${msgData.projectKey}\n`);

		for(const [msgId, logs] of Object.entries(msgData.logs as object)){
			const date = new Date().toISOString().replace("T", "  ").replace(/\..+/, "");
			yield Buffer.from(JSON.stringify([msgId, date, logs]));
		};
	};

	private process = async(msgData:MSG_DATA):Promise<void> => {
		const filePath:string | any = this.PathMap.get(msgData.projectKey as any);
		const file = Bun.file(filePath);

		let counter = this.ENTRY_COUNTS.get(msgData.projectKey as any);
		if(counter === undefined) counter = 0; 
		
		try{
			for await(const data of this.iter(msgData)){
				counter++
				let chunk = this.decode.decode(data, { stream:true });
				file.writer().write(chunk);
			};

			const leftovers = this.decode.decode();
			if(leftovers){
				file.writer().write(leftovers);
			};
			
			this.ENTRY_COUNTS.set(msgData.projectKey as any, counter);

		}catch(err){ 
			// instead of throwing and crashing app
			// find a way to just fail silently
			throw err;
		}finally{
			file.writer().end()
			await this.checkPathLength(msgData.projectKey);
		};
	};

	private checkPathLength = async(projectKey:string | any) => {
		const count = this.ENTRY_COUNTS.get(projectKey);
		if(count === this.ROTATE_THRESHOLD) await this.rotate(projectKey);
		return count;
	}
};



