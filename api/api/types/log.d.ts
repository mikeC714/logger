export type LOG = {
	username:string;
	logId:string;
	logName:string;
	severity?:string | number;
	msg?:string;
	timestamp?:Date;
}
