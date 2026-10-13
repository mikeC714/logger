import * as fastify from "fastify";
import { Redis } from "ioredis";
import { PostgresDb } from "@fastify/postgres";
import { Server } from "socket.io";

declare module 'fastify'{
	interface FastifyInstance{
		db:PostgresDb;
		redis:Redis;
		io:Server;
	} 
}
