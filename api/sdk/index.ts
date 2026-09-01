import { Stream } from "../stream/stream.ts";

type NOTI = {
	send:boolean;
	recipient:string;
	logType:object | string;
}
 const META_BODY:Record<string, string | number | null> = {
	userId:"",
	username:"",
	role:"",
	enviroment:"",
	version:"",
	errorCode:"",
	errorStatus:0,
	timeStamp:null
};

let LEVELS:any = ["info","warn","error","fatal","debug",];
const CONFIG = {
	projectKey:"" as string,
	notifications:{
		send:false,
		logTypes:{
			...LEVELS
		} = "all",
		recipient:""
	}
} as const;


export class Logger{
	private server:string = process.env.SERVER as string;
	private batchLimit:number = 20;
	private stream:Stream;
	private batch:Array<object> = []; 
	private timer:any = null;
	private timeLimit:number = 5000;
	config:typeof CONFIG;

	constructor(config: Partial<typeof CONFIG> & { notifications?: Partial<typeof CONFIG.notifications> } = {}){
		this.config = {
			...CONFIG,
			...config,
			notifications:{
				...CONFIG.notifications,
				...config.notifications
			}
		};
		this.stream = new Stream({ projectKey:this.config.projectKey });
		this.init();
	}

	private init = async() => {
		await this.stream.createGroup(this.config.projectKey);	
	};

	public log = async(options:Record<string, string | object > = { lvl:"info", msg:"", meta:META_BODY }) => {
		// validate the shape of the parameters
		if(!LEVELS.includes(options.lvl)) throw new Error(`${options.lvl} parameter isn't a value for LVL: ${LEVELS}`);
		if(Object.keys(META_BODY).every((key) => META_BODY[key] !== options[key])) throw new Error(`${JSON.stringify(options)} don't match the given fields ${JSON.stringify(META_BODY)}`); 

		// check the length of the batch 
		// if the batch length isn't at limit push item into batch
		// clear timer if there were any previous additions to the batch previously
		if(this.batch.length !== this.batchLimit && this.timer !== null){
			this.batch.push(options);
			clearTimeout(this.timer);
		};

		try{
			// if batch length is at limit call flush
			if(this.batch.length >= this.batchLimit){ 
				return await this.flush();	
			};
			// if limit isn't met but there are logs don't allow them to go stale
			// instead run a timer that calls flush when expiration limit ends (5seconds); 
			return this.timer = new Promise((res) => setTimeout(async() => res(await this.flush()), this.timeLimit));
		}catch{}

	};

	private notify = async(lvl:string, msg:string, meta:object = META_BODY) => {
		if(this.config.notifications.send !== false && this.config.notifications.recipient !== "" || this.config.notifications.recipient !== null){
			try{
			// use notifcations library 
			}catch(err){
				//logger err to alerts
			}
		}
	};

	private flush = async() => {
		try{
			const res:any = await fetch(this.server,{
				method:"POST",
				headers:{
					"Content-Type": "application/json"
				},
				body: JSON.stringify([this.config.projectKey, this.batch])
			}).then(res => res.json());	

			if(res.ok !== true){
				setTimeout(async() => {
					await this.flush();
				}, 2500);
			}else if(res.ok === true){
				this.batch = [];
			}
		}catch{ }
	};
}
