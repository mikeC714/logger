export async function apiFetch(url:any, method:string="GET", body:null | {}){
	let error:any;
	try{
		const res = await fetch(url, {
			method:method,
			body:JSON.stringify({
				...(body && { body:JSON.stringify(body) })
			})
		})
		if(!res.ok){
			let msg:string;
			const type = res.headers.get("Content-Type");
			if(type && type.includes("application/json")){
				error = await res.json();
				msg = error.message; 
			}
			throw new Error(msg);
 		}
		return await res.json();
	}catch(err){
		throw err;
	}
}
