const META_BODY = {
	userId:"",
	username:"",
	role:"",
	enviroment:"",
	version:"",
	errorCode:"",
	errorStatus:0,
	timeStamp:""
} as const;

const LEVELS = {
	info:"info",
	warn:"warn",
	error:"error",
	fatal:"fatal",
	debug:"debug"
} as const;


type MSG = {
	lvl:typeof LEVELS;
	msg:string;
	meta:typeof META_BODY;
};
type MSG_DATA = Record<string, {
	projectKey:string;
	msg:MSG_DATA;
}>;


export { META_BODY, LEVELS, MSG, MSG_DATA };

