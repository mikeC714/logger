import fp from "fastify-plugin";
import { date } from "../../utils/date.ts";
import { AppError } from "../errors/app.err.ts";
import { LogError } from "../errors/log.err.ts";
import { AuthError } from "../errors/auth.err.ts";
import type { FastifyReply, FastifyRequest, FastifyError } from "fastify"; 

export async function err_plugin(fastify:any, opts:{}){
	fastify.setErrorHandler((err:FastifyError, req:FastifyRequest, rep:FastifyReply) => {

		if(err.validation) {
			return rep.status(400).send({
				error:'ERR_VALIDATION',
				message: err.message
			});
		}else if(err instanceof AppError){
			return rep.status(err.statusCode).send({ 
				ok:false, 
				message: err.message 
			});
		}else if(err instanceof LogError){
			fastify.log.error(`${date} Log failure ${err.message}`);
			return rep.status(err.statusCode).send({ 
				ok:false, 
				message: err.message 
			});
		}else if(err instanceof AuthError){
			return rep.status(err.statusCode).send();
		}

		fastify.log.error(`${date} Server Failure:${err.message}`);		
		return rep.status(500).send({ error: "Internal Server Error", msg:err });
	})
}
export const ERR_PLUGIN = fp(err_plugin); 

