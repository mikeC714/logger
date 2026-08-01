import { Auth } from "./auth.service.ts";
import { pg } from "../config/db.config.ts";
const auth = new Auth(pg);

interface AUTH_BODY{
	username:string;
	passphrase:string;
}

export const AuthController = {
	signup: async(req:Request):Promise<Response> => {
		const body = await req.json() as AUTH_BODY;
		const { username, passphrase } = body;
		try{
			const user = await auth.login(username, passphrase)	
			return Response.json({ ok:true, user })
		}catch(err){
			throw err
		}
	},
	login: async(req:Request):Promise<Response> => {
		const body = await req.json() as AUTH_BODY;
		const { username, passphrase } = body;
		try{
			const user = await auth.login(username, passphrase)	
			return Response.json({ ok:true, user })
		}catch(err){
			throw err;
		}
	}
};
