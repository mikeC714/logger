import { BoxRenderable, InputRenderable, InputRenderableEvents, t, bold, Box } from "@opentui/core";
import { Methods } from "../../methods.ts";


const methods = new Methods();

export function Input(type:string, main:any){
	let placeholder:string = ""

	const container = new BoxRenderable(main, {
		id:"inputContainer",
	});	
	const input = new InputRenderable(main, {
		id:"input",
		focusedBackgroundColor:"",
		placeholder:placeholder
	});

	switch(type){
		case "create":
			placeholder = "Enter new log name";
			input.on(InputRenderableEvents.ENTER, (value:string) => {
				value = value.toLowerCase().trim();
				methods.create(value);
			});	
		break;
		case "delete":
			placeholder = "Enter log to delete.";
			input.on(InputRenderableEvents.ENTER, (value:string) => {
				methods.delete(value);
			});	
		break;
		case "search":
			placeholder = "Enter log name";
			input.on(InputRenderableEvents.ENTER, (value:string) => {
				return methods.search(value);
			});	
		break;
	}	
	container.add(input);

	return container; 
}
