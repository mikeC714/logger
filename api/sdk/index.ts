
interface LOGGER{
	[index:string]: (meta:object, msg:string) => Promise<any>;
}
type NOTI = {
	send:boolean;
	recipient:string;
	logType:object | string;
}
 const metaBody = {
	userId:"",
	username:"",
	role:"",
	enviroment:"",
	version:"",
	errorCode:"",
	errorStatus:0,
	timeStamp:""
};

let LEVELS:any = ["info","warn","error","fatal","debug",];
export function createLogger(
	projectKey:string,
	server:string = process.env.SERVER as string,
	notitifications:NOTI = {
		send:false,
		logType:{
			...LEVELS
		} = "all",
		recipient:""
	},
	batch_limit:number = 20
){
	let batch:Array<object> = [];

	if(projectKey === "" || projectKey === undefined) throw new Error(`Project key is needed in order to proceed with logging. Read documentation if help is needed ${process.env.DOCUMENTATION}.`);
	
	async function notify(lvl:string, msg:string, meta:object = metaBody){
		if(notitifications.send === true && notitifications.recipient !== "" || notitifications.recipient !== null){
			try{
			// use notifcations library 
			}catch(err){
				//logger err to alerts
			}
		}
	}

	async function log(lvl:string, msg:string, meta:object = metaBody){
		batch.push({lvl, msg, meta});	
		if(batch.length >= batch_limit) flush();
	}

	 async function flush(){
		if(batch.length < batch_limit || batch.length === 0) return;
		try{
			await fetch(server, {
				method: "POST",
				headers:{
					"Content-Type": "application/json"
				},
				body: JSON.stringify(batch)
			})
			batch = [];
		}catch{}
	}

	const logger:LOGGER = {};
	for(const lvl of LEVELS){
		logger[lvl] = (meta:object, msg:string) => log(lvl, msg, meta); 
	}

	return logger;
}

