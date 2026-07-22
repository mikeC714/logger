export async function ERROR(error:{}){
	return await fetch(`${process.env.SERVER}/api/log/error`, {
		method: "POST",
		headers:{
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			...error		
		})
	})			
}
