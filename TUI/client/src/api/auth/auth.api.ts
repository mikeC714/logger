import { apiFetch } from "../../utils/apiFetch.ts";

interface AUTH {
	username: string;
	passphrase:string;
};

export function AUTH():{login:(username:string, passphrase:string) => Promise<any>, signup:(username:string, passphrase:string) => Promise<any>}{
	const login = async (username:string, passphrase:string):Promise<any>=>{ 
		const res = await apiFetch(`${process.env.SERVER}/api/auth/login`, "POST", { username, passphrase })
		return res;
	};
	const signup = async(username:string, passphrase:string):Promise<any> => {
		const res = await apiFetch(`${process.env.SERVER}/api/auth/signup`, "POST", { username, passphrase })
		return res;
	};
	return { login, signup }
};
