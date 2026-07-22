import { AuthError } from "../../errors/auth.err.ts"
import { AppError } from "../../errors/app.err.ts";
import type { User } from "../../types/user.d.ts";
import bcrypt from "bcrypt";

export class AuthService{
	db:any
	constructor(db:any){
		this.db = db;
	}

	public find_user = async(username:string, passphrase?:any):Promise<{username:string, found:boolean}> => {
		if(!username || username.length < 1) throw new AppError("Invalid username input, please try again.", 400);
		try{
			const user = await this.db.query(
				`SELECT username, passphrase 
					FROM users
					WHERE username = $1
				`,[username]
			);
			const found = user.rows.length !== 0;
			if(passphrase && found === false) throw new AuthError("Invalid credentials");
			if(passphrase && found === true){
				const valid = await bcrypt.compare(passphrase, user.rows[0].passphrase);
				if(!valid) throw new AuthError("Invalid credentials");
			}
			return {
				username,	
				found
			};			
		}catch(err){
			throw err;
		}	
	}
	public async new_acc(username:string, passphrase:string):Promise<User["username"]>{
		const { found } = await this.find_user(username); 
		if(found) throw new AuthError(`${username} is not available. Please choose something unique.`, 409);

		if(!username || username.length === 0) throw new AuthError("Failed to provide a username, please try agian.",400);

		if(!passphrase || passphrase.length <= 8){
			throw new AuthError("Invalid passphrase. Passphrase needs to be over 8 characters long.")
		}
		try{
			const safe = await bcrypt.hash(passphrase, 12);
			await this.db.query(	
				`INSERT INTO users
					(username, passphrase)
					VALUES($1, $2)
				RETURNING username, created_at
				`,[username, safe]
			)
			return username;
		}catch(err:any){
			if(err.code === "23505") throw new AuthError(`${username} is not available. Please choose something unique.`, 409); 
			if(err.code === "K8008") throw new AuthError(`${username} is already associated with key. Use login (L) to access your logs`, 401);
		throw err;
		}
	}
}
