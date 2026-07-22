export function AUTH(){
	
	const login = async (username:string, passphrase:string) =>{ 
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

	const signup = async(username:string, passphrase:string) => {
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
