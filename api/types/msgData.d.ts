export type MSG_DATA = Record<string, {
	lvl: string;
	msg: string;
	meta: {
		userId?:string,
		username?:string,
		role?:string,
		enviroment?:string,
		version?:string,
		errorCode?:string,
		errorStatus?:number,
		timeStamp?:string
	};
}>;
