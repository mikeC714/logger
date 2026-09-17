import { Body } from "../comps/body.ts";
import { Footer } from "../comps/footer.ts";
import { Overlay } from "../comps/input.ts";
import { BoxRenderable } from "@opentui/core";
import { Log } from "../../app/log.ts";
import type { DISPLAY_HINTS } from "../types/hints.d.ts";

const HINTS:DISPLAY_HINTS = {
	normal: "[|] refresh  [/] search",
	search: "SEARCH — type a filter, Enter to apply, Esc to cancel",
	refresh: "REFRESH — refresh log"
} 

export function Display(main:any, log:Log, projectKey?:string){
	const container = new BoxRenderable(main,{
		id:"displayContainer",
	});
	const body = Body(main);
	const { footer, showWarnErrorCount, setMode } = Footer(main, HINTS);		
	const input = Overlay(main, {
		onSubmit:(mode, value) => handleOverlaySubmit(mode,value),
		onCancel: () => handleOverlayCancel()
	});

	function openSearch(){
		setMode("search");
		input.open("search");
	};

	function handleOverlayCancel(){
		setMode("normal");
	};

	function handleOverlaySubmit(mode:string, value:any){
		switch (mode){
			case "search":
				log.filterLogs(projectKey, value)
			break;
			case "refresh":
				log.getAllLogs(projectKey as string)
			break;
		};
	}
	

	container.add(body)
	container.add(footer);

	return { 
		display:container,
	}
}



