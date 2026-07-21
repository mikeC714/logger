import { AuthError } from "../plugins/error/auth.err.ts"
import type { User } from "../types/user.d.ts";
import bcrypt from "bcrypt";

export class AuthService{
	private readonly username = "user";
	constructor(private db:any){}

	async find_user(username:string, passphrase?:any):Promise<{username:string, found:boolean}>{
		let found = false;
		try{
			const user = await this.db.query(
				`SELECT username, passphrase 
					FROM users
					WHERE username = $1
				`,[username]
			);
			const valid = bcrypt.compare(passphrase, user.rows[0].passphrase);
			if(!valid) throw new AuthError("Invalid credentials");
			if(user.rows.length !== 0) found = true;
			return {
				username,	
				found
			};			
		}catch(err){
			throw err;
		}	
	}
	async new_acc(username:string, passphrase:string):Promise<User["username"]>{
		const { found } = await this.find_user(username).catch((err:any) => { throw err });
		if(found) throw new AuthError(`${username} is not available. Please choose something unique.`, 409);

		if(!username || username.length === 0){
			username = this.username;
		}
		if(!passphrase || passphrase.length <= 8){
			console.error("Invalid passphrase. Passphrase needs to be over 8 characters long.");
			process.exit(1);
		}
		try{
			const safe = bcrypt.hash(passphrase, 12);
			await this.db.query(	
				`INSERT INTO users
					(username, passphrase)
					VALUES($1, $2)
				RETUNRNING username, created_at
				`,[username, safe]
			)
			return username;
		}catch(err:any){
			if(err.statusCode === "23505") throw new AuthError(`${username} is not available. Please choose something unique.`, 409); 
			if(err.statusCode === "K8008") throw new AuthError(`${username} is already associated with key. Use login (L) to access your logs`, 401);
			throw err;
		}
	}
}
