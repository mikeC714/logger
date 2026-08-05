import { Redis } from "ioredis";
import { PostgresDb } from "@fastify/postgres";

declare module 'fastify'{
	interface FastifiyInstance{
		db:PostgresDb;
		redis:Redis;
	} 
}
