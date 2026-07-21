export class AppError extends Error{
	status_code:number;
	code: number | string;
	constructor(msg:string, status_code:number, code:string | number = "ERR_APP"){
		super(msg);
		this.status_code = status_code;
		this.code = code;
	}
}
