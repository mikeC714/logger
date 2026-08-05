export class AuthError extends Error{
	statusCode: number;
	code: string | number;
	constructor(msg: string, statusCode:number = 401, code: string | number = "ERR_AUTH" ){
		super(msg);
		this.statusCode = statusCode;
		this.code = code;
	}
}
