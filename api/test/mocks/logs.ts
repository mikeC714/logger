const log = [
	"TESTING_LOG_STREAM",
	[
		{ lvl:"info", msg:"Testing socket", meta:{} },
		{ lvl:"fatal", msg:"Payment Failure", meta:{} },
		{ lvl:"warn", msg:"Be Careful", meta:{} },
		{ lvl:"error", msg:"Payment crash", meta:{} },
		{ lvl:"debug", msg:"Testing ", meta:{} },
		{ lvl:"warn", msg:"Invalid Credentials", meta:{} },
		{ lvl:"fatal", msg:"Payment Failure", meta:{} },
		{ lvl:"error", msg:"Payment Crash", meta:{} },
		{ lvl:"fatal", msg:"Server Down", meta:{} },
		{ lvl:"warn", msg:"Invalid User", meta:{} },
		{ lvl:"error", msg:"Socket Crash", meta:{} },
		{ lvl:"fatal", msg:"Server Down", meta:{} },
		{ lvl:"fatal", msg:"Server Down", meta:{} },
		{ lvl:"fatal", msg:"Server Down", meta:{} },
		{ lvl:"fatal", msg:"Redis Down", meta:{} },
		{ lvl:"error", msg:"Socket Disconnect", meta:{} },
		{ lvl:"info", msg:"Server Online", meta:{} },
		{ lvl:"info", msg:"Socket Online", meta:{} },
		{ lvl:"info", msg:"Socket Online", meta:{} },
		{ lvl:"info", msg:"Socket Online", meta:{} },
	]
]; 
const LOG = (overrides?:any) => {
	return [
		...overrides,
		...log
	]
}


export { log, LOG };
