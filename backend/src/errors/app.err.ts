export class AppError extends Error{
	statusCode:number;
	code: number | string;
	constructor(msg:string, statusCode:number, code:string | number = "ERR_APP"){
		super(msg);
		this.statusCode = statusCode;
		this.code = code;
	}
}
