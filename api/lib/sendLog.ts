export async function sendLog(msg:string){
	try{
		const res = await fetch(process.env.LOG_MACHINE!, {
			method:"POST",
			body:msg,
			headers:{ "Content-type":"application/json" }
		}).then(res => res.json());

		if(!res.ok){
			throw new Error("Failed to deliver log msg");
		};

	}catch(e){
		throw e;
	}	
}
