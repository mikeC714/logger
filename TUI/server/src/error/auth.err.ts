export class AuthError extends Error{
	statusCode:number;
	code?:string;
	constructor(message:string, statusCode:number = 401, code?:string,){
		super(message);
		this.message = message;
		this.code = code;
		this.statusCode = statusCode;
	}
}
