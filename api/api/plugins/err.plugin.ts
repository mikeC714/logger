import fp from "fastify-plugin";
import type { FastifyReply, FastifyRequest, FastifyError } from "fastify"; 
import { AppError } from "../errors/app.err.ts";

export async function err_plugin(fastify:any, opts:{}){
	fastify.setErrorHandler((err:FastifyError, req:FastifyRequest, rep:FastifyReply) => {
		if(err.validation) {
			return rep.status(400).send({
				error:'ERR_VALIDATION',
				message: err.message
			});
		}else if(err instanceof AppError){
			return rep.status(err.statusCode).send({ ok:false, message: err.message })
		};
		
		// if(err instanceof AppError){
		// 	req.log.error({ err });
		// }else 
		req.log.error({ err });		
		return rep.status(500).send({ error: "Internal Server Error", wtf: err});
	})
}
export const ERR_PLUGIN = fp(err_plugin); 

