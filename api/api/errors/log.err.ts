export class LogError extends Error{
	statusCode:number;
	code:string | number; 
	constructor(msg:string, statusCode:number, code:string | number = "LOG_ERR"){
		super(msg);
		this.statusCode = statusCode;
		this.code = code;
	}
}
