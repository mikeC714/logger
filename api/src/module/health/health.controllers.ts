import { Health } from "../services/health.service.ts";
import { db, test_db } from "../plugins/db.ts";
import { redis } from "../plugins/redis.ts";
import { FastifyRequest, FastifyReply } from "fastify";
const health = new Health(db, redis);



export async function health_check(request:FastifyRequest, reply:FastifyReply){
	const res = await health.PING();  
	return reply.status(200).send(res);
}

