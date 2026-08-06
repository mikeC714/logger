export class ArchiveControllers{
	archive:any;
	constructor(archive:any){
		this.archive = archive;
	}	

	 getArchive = async(req:Request):Promise<Response> => {
		return Response.json()
	 };

	 deleteArchvie = async(req:Request):Promise<Response> => {
		
		 return Response.json();
	 };
}
