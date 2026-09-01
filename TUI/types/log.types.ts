enum LOG_STATUS {
	private = "private",
	public = "public"
}

type LOG_DETAILS = {
	id?:string;
	viewers?: Array<string>;
	status?: LOG_STATUS;
	name?: string;
}
type LOG = {
	fileId: string;
	chunkIndex: string;
	totalChunks: string;
	data: string;
}


interface LOG_API{
	create:(logDetails:LOG_DETAILS["name"]) => Promise<{details:LOG_DETAILS, log:LOG} | any>;
	remove: (logName:LOG_DETAILS["name"]) => Promise< any | {ok: boolean}>;
	join?:(logDetails:LOG_DETAILS) => Promise<{details:LOG_DETAILS, log:LOG}>;
	leave?:(logDetails:LOG_DETAILS["id"]) => Promise<void>
}

export type { LOG_DETAILS, LOG_STATUS, LOG, LOG_API };
