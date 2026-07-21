export class AuthError extends Error{
	status_code: number;
	code: string | number;
	constructor(msg: string, status_code:number = 401, code: string | number = "ERR_AUTH" ){
		super(msg);
		this.status_code = status_code;
		this.code = code;
	}
}
