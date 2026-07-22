export type ERR = {
	status_code:number;
	message:string;
}

export interface LOG_ERR{
	title?:string;
	req_id?:string;
	timestamp?:Date;
	user_id?:string;
	error:ERR;
}


