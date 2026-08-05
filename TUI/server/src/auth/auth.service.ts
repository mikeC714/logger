import { SQL } from "bun";
import { AuthError } from "../error/auth.err.ts";


interface USER{
	username:string;
	passphrase:string;
}

export class Auth{
	private pass_limit:number = 8;
	private username_limit:number = 1;
	private db:SQL;
	constructor(db:SQL){
		this.db = db
	}
		
	async signup(username:USER["username"], passphrase:USER["passphrase"]):Promise<string | Error>{
		if(!username || username.length <= this.username_limit) throw new AuthError(`Invalid username. Username length needs to exceed ${this.username_limit}`,400);
		if(!passphrase || passphrase.length <= this.pass_limit) throw new AuthError(`Invalid passphrase. Passphrase length needs to exceed ${this.pass_limit}`,400);

		try{

			const safe = await Bun.password.hash(passphrase,{
				algorithm:"bcrypt",
				cost:8
			});

			await this.db`
				INSERT INTO users(username, passphrase)
					VALUES(${username}, ${safe})
			`;

			return username;
		}catch(err:any){
			if(err.statusCode === "23505") throw new AuthError("Invalid credentials.");
			throw err;
		}
	}

	async login(username:USER["username"], passphrase:USER["passphrase"]):Promise<string | Error>{
		if(!username || username.length <= this.username_limit) throw new AuthError(`Invalid username. Username length needs to exceed ${this.username_limit}`,400);
		if(!passphrase || passphrase.length <= this.pass_limit) throw new AuthError(`Invalid passphrase. Passphrase length needs to exceed ${this.pass_limit}`,400);
		
		try{
			const user = await this.db`
				SELECT username, passphrase 
					FROM users
					WHERE username = ${username} 
			`;
			const valid = await Bun.password.verify(passphrase, user.passphrase);
			if(valid !== true) throw new AuthError("Invalid credentials.Please try again", 401);

			return username;
		}catch(err:any){
			if(err.statusCode === "02000") throw new AuthError("Invalid credentials.Please try agian.",401);
			throw err;
		}
	}
} 
