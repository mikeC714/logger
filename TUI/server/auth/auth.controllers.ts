import { AuthService } from "./auth.service.ts";
import type { USER } from "../types/user.d.ts";

export class AuthControllers{
	auth:AuthService;
	constructor(auth:AuthService){
		this.auth = auth; 
	}

	signup = async(req:Request):Promise<Response> => {
		const body = await req.json().catch((err) => {
			throw new Error(err);
		});
		const user = await this.auth.signup(body as USER); 
		return Response.json(user)
	};
	login = async(req:Request):Promise<Response> => {
		const body = await req.json().catch((err) => {
			throw new Error(err);
		});
		const user = await this.auth.login(body as USER); 
		return Response.json(user)
	};

}
