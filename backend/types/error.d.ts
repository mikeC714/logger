type ERR = {
	statusCode:number;
	message:string;
}

export interface LOG_ERR{
	title?:string;
	reqId?:string;
	timestamp?:Date;
	userId?:string;
	error:ERR;
}


