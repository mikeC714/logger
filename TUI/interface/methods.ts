import { Folder } from "../app/folder.ts";

export class Methods{
	private folder = new Folder();

	async create(logName:string){
		try{
			await this.folder.create(logName);
		}catch(e){

		}
	};
	async delete(logName:string){
		try{
			await this.folder.delete(logName);
			return `Successfully deleted Log: ${logName}`;
		}catch(e:any){
			console.error(`FAILURE. Failed to delete Log: ${logName}. ${e.message}`);
		}
	};
	async search(value:string){
		let results:Array<Array<string>> = [];
		const paths = this.folder.data();	

		for(const [key, path] of paths){
			if(key.includes(value)){
				results.push([key, path]);
			}
		}
		return results; 
	};
}


