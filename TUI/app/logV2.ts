import { Database } from "bun:sqlite";
import { EventEmitter } from "node:events";


export class Log extends EventEmitter{
	private PathMap:Map<string, string> = new Map();
	constructor(private db:Database){
		super();
		this.initEvents();
	}

	initEvents = () => {
		this.on("create", (path:string, fn) => {
			try{
				this.create(path);
				fn({ok:true, error:null});
			}catch(e){
				fn({ ok:false, error:e })
			}
		})
		this.on("delete", (path:string, fn) => {
			try{
				this.delete(path);
				fn({ok:true, error:null});
			}catch(e){
				fn({ ok:false, error:e })
			}
		})
		this.on("write", (path:string, msgs:any, fn) => {
			try{
				this.write(path, msgs);
				fn({ ok:true, error:null })
			}catch(e){
				fn({ ok:false, error:e });
			}
		})
		this.on("getAll", async() => {
			try{
				return await this.getAllLogs()
			}catch(e){
			}
		})
		this.on("getAll", async(path:string) => {
			try{
				return await this.getLog(path)
			}catch(e){
			}
		})
	}	

	create = (path:string) => {}
	delete = (path:string) => {}
	write = (path:string, msgs:any) => {}
	getAllLogs = async() => {}
	getLog = async(path:string) => {}


}
