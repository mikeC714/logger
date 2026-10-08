import type { FastifyInstance } from "fastify";


export function callHealthCheck( machine:string, machineKey:string, fastify:FastifyInstance, retries = 3){
	setInterval(async() => {
		const date = new Date(Date.now()).toISOString().split("T").join(" ");
		try{
			// call the health endpoint
			const res:any = await fetch(`${machine}/api/health`, {
				method:"GET",
				headers:{
					"x-machine-key": machineKey
				}
			}).then(res => res.json());	


			//check if fetch call failed
			//if so throw err;
			if(!res.ok){
				fastify.log.debug(`Failed check health of machine:${machineName},  ${date}`);
				throw new Error(`Failed to check health of machine:${machineName}`);
			};
			
			fastify.log.info(`${machine} is healthy.`);
			return;

		// catch error
		// but instead of throwing the error immediately retry
		// check if retry count is < 1 
		// if it is then throw an error
		// if not call function recursively 
		}catch(e:Error | any){
			if(retries <= 1){
				fastify.log.error(`Failed retry attempts on health check for machine:${machineName}`);
				throw new Error("Max health check reached");
			};
			return callHealthCheck(machineName, machine, machineKey, fastify, retries - 1);
		}		
	}, 5000);		
}
