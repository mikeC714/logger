import type { FastifyRequest, FastifyReply } from "fastify";
import type { User } from "../../types/user.d.ts";

export class Auth{
	auth:any
	constructor(auth:any){
		this.auth = auth;
	}
	public login = async(req:FastifyRequest<{ Body:User }>, rep:FastifyReply) => {
		const { username, passphrase } = req.body;
		const user = await this.auth.find_user(username as string, passphrase);
		return rep.status(200).send({ ok: true, user: user.username });
	}	
	public signup = async(req:FastifyRequest<{ Body:User}>, rep:FastifyReply) => {
		const { username, passphrase } = req.body;
		const user = await this.auth.new_acc(username as string, passphrase as string);
		return rep.status(201).send({ ok: true, user });
	}
	//TODO 
		//LOGOUT
		//IN ORDER TO LOGOUT A COMMAND WILL BE USED
		// (Q)uit WILL BE USED AND ALL IT WILL DO IS END THE PROCESS USING process.exit(1) TERMIANTING THE APPLICATION
}
