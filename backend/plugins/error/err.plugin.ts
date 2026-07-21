import fp from "fastify-plugin";
import type { FastifyReply, FastifyRequest } from "fastify"; 
import { AuthError } from "./auth.err.ts";
import { AppError } from "./app.err.ts";

export async function err_plugin(fastify:any, opts:{}){
	fastify.setErrorHandler((err:any, req:FastifyRequest, rep:FastifyReply) => {
		if(err.validation) {
			return rep.status(400).send({
				error:'ERR_VALIDATION',
				message: err.message
			});
		}
		if(err instanceof AppError){
			req.log.info({ error: {
					...err
				}
			});
		}else if(err instanceof AuthError){
			return rep.status(err.status_code).send({ ok:false, message: err.message })
		}
		return rep.status(500).send({ error: "Internal Server Error" });
	})
}
export const ERR_PLUGIN = fp(err_plugin); 

