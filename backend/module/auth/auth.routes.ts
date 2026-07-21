import { Auth } from "./auth.controllers.ts";
import { AuthService } from "./auth.service.ts";
import { db } from "../../plugins/db/db.plugin.ts";
import { login_schema } from "../auth/schema/login.schema.ts";
import { signup_schema } from "../auth/schema/signup.schema.ts";


export function AUTH_ROUTER(fastify:any, opts:{}){
	const auth_service = new AuthService(db);
	const auth = new Auth(auth_service);

	fastify.post("/auth/login", { schema: login_schema }, auth.login);
	fastify.post("/auth/signup", { schema: signup_schema }, auth.signup);
}


