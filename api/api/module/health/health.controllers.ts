import type { FastifyRequest, FastifyReply } from "fastify";

export class HealthController{
	health:any;
	constructor(health:any){
		this.health = health;
	}

	healthCheck = async(req:FastifyRequest, rep:FastifyReply) => {

		const res = await this.health.PING();  
		return rep.status(200).send(res);
	}
}

