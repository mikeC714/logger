import { AuthError } from "../error/auth.err.ts";
import { Database } from "bun:sqlite";
import type { USER } from "../types/user.d.ts";

export class AuthService{
	private username_min = 8; 
	private username_max = 30; 
	private passphrase_min = 6;
	db: Database;
	constructor(db:Database){
		this.db = db;
	}

	signup = async(user:USER):Promise<string | void> => {
		const { username, passphrase } = user;
		if(username.length < this.username_min || username.length >= this.username_max){
			console.error("Invalid username length please try again.");
			return;
		};
		try{
			const safe = await Bun.password.hash(passphrase,{
				algorithm:"bcrypt",
				cost:8
			});
			 this.db.run(
				`INSERT INTO users 
					(username, passphrase)
					VALUES(?,?)
				`,[username, safe]
			);	
			return username;	
		}catch(err){
			throw err;
		}
	};

	login = async(user:USER):Promise<string | void> => {
		const { username, passphrase } = user;
		if(username.length < this.username_min || username.length >= this.username_max){
			console.error("Invalid username length please try again.");
			return;
		};
		try{
			 const res:any = this.db.query(
				`SELECT passphrase FROM users 
					WHERE username = ?
				`
			).get(username);	

			const valid = Bun.password.verify(passphrase, res.passphrase);
			if(!valid) throw new AuthError("Invalid Credentials. Please try again.");

			return username;	
		}catch(err){
			throw err;
		}
	};
}
