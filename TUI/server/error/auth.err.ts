export class AuthError extends Error{
	statusCode:number;
	code:number | string;
	constructor(message:string, code?:string, statusCode?:number,){
		super();
		this.statusCode = statusCode = 401;
		this.code = code || "AUTH_ERR";
		this.message = message;
	}
}
