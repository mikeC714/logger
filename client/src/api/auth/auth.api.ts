export function AUTH():{login:(username:string, passphrase:string) => Promise<void>, signup:(username:string, passphrase:string) => Promise<void>}{
	const login = async (username:string, passphrase:string):Promise<void>=>{ 
		 await fetch(`${process.env.SERVER}/api/auth/login`, {
			method: "POST",
			headers:{
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				passphrase
			})

		 })
			.then(res => {
				if(!res.ok){
					console.error(`ERROR:${res}`);
				}
				return res.json();
			})
			.catch(err =>{
				console.error(`FAILURE: ${err}`);	
			})
	};
	const signup = async(username:string, passphrase:string):Promise<void> => {
		await fetch(`${process.env.SERVER}/api/auth/signup`, {
			method: "POST",
			headers:{
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				passphrase
			})
		})
			.then(res => {
				if(!res.ok){
					console.error(`ERROR:${res}`);
				}
				return res.json();
			})
			.catch(err =>{
				console.error(`FAILURE: ${err}`);	
			})
		}
	return { login, signup }
} 
