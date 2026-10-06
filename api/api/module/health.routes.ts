import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { healthSchema } from "./health.schema.ts";
import { AuthError } from "../errors/auth.err.ts";
import { AppError } from "../errors/app.err.ts";


interface HEADERS{
	"x-machine-key":string
};

export function healthRoutes(fastify:FastifyInstance){

	fastify.get("/health", { 
			config:{ 
				rateLimit:{
					max:10,
					timeWindow:"5 minutes"
				} 
			},
			schema:healthSchema 
	}, async(req:FastifyRequest<{ Headers:HEADERS }>, rep:FastifyReply) => {

		try{
			const machine = req.headers["x-machine-key"];
			if(!machine || machine.length === 0){
				fastify.log.warn(`${req.ip} attempted to make a request with invalid headers`);				
				throw new AuthError("Failed to provide valid headers", 400);
			};

			// decrypt headers

			let validMachines = process.env.MACHINES;
			if(validMachines === undefined) throw new AppError("Failed to instantiate valid machines for health route", 500);

			validMachines = JSON.parse(validMachines);
			if(!validMachines?.includes(machine)){
				fastify.log.warn(`${req.ip} attempted to make a request with invalid machine`);				
				throw new AuthError("Invalid machine", 401);
			};

		}catch(e){ 
			throw e;
		};

		const date = new Date(Date.now()).toISOString().split("T").join(" ");

	return rep.code(200).send({ 
			ok:true,
			checked:date
		});
	})
}
