export async function parseCsv(content:string):Promise<Array<object>>{
	const lines:any = content.split("").map(line => line.trim());	
	const headers = lines[0].split(",");
	return lines.slice(1).map((line:any) => {
		const values:any = line.split(""); 	
		const obj:any = {};

		headers.forEach((head:string, index:number) => {
			obj[head] = values[index];	
		})
		return obj;
	})
};
