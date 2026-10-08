export class AuthError extends Error{
	statusCode:number;
	code:string | number; 
	constructor(msg:string, statusCode:number, code:string | number = "ERR_AUTH"){
		super(msg);
		this.statusCode = statusCode;
		this.code = code;
	}
};
