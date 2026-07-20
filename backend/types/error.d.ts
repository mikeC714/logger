export interface Error{
	statusCode:number;
	message:string;
	reqId?:string;
	timestamp?:Date;
	userId?:string;
}

