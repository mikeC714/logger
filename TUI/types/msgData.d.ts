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
	lvl:string;
	msg:string;
	meta:typeof META_BODY;
};
type MSG_DATA = [ 
	projectKey:string,
	logs:Array<MSG>,
];


export { META_BODY, LEVELS, MSG, MSG_DATA };

