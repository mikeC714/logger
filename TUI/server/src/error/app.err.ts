export class AppError extends Error{
	statusCode:number;
	code?:string;
	constructor(message:string, statusCode:number = 400, code?:string,){
		super(message);
		this.message = message;
		this.code = code;
		this.statusCode = statusCode;
	}
}
