import { Body } from "../comps/body.ts";
import { Footer } from "../comps/footer.ts";
import { Overlay } from "../comps/input.ts";
import { BoxRenderable } from "@opentui/core";
import { Log } from "../../app/log.ts";
import type { DISPLAY_HINTS } from "../../types/hints.d.ts";

const HINTS:DISPLAY_HINTS = {
	normal: "[|] refresh  [/] search",
	search: "SEARCH — type a filter, Enter to apply, Esc to cancel",
	refresh: "REFRESH — refresh log"
} 

export function DisplayPage(main:any, log:Log, projectKey:string){
	let previousPage = ""

	const container = new BoxRenderable(main,{
		id:"displayContainer",
	});
	const body = Body(main);
	log.getAllLogs(projectKey) .then((logs:any) => body.showLog(projectKey, logs));

	const { footer, showWarnErrorCount, setMode } = Footer(main, HINTS);		
	log.getLogErrorAndWarnCount(projectKey).then((count:any) => showWarnErrorCount(count))

	const input = Overlay(main, {
		onSubmit:(_, value) => handleOverlaySubmit(value),
		onCancel: () => handleOverlayCancel()
	});

	function openSearch(){
		setMode("search");
		input.open("search");
	};

	function refresh(){
		log.getAllLogs(projectKey);
	};

	function handleOverlayCancel(){
		setMode("normal");
	};
	
	function handleOverlaySubmit(value:string){
		if(value.length === 0 || value === undefined) return;
		log.filterLog(projectKey, value)
	};

	main.keyInput.on("keypress", (key: any) => {
		if (input.isOpen()) {
			if (key.name === "escape") input.cancel();
			return; 
		}
		switch (key.name) {
			case "r":
				refresh();
			break;
			case "/":
				openSearch();
			break;
		};
	});

	container.add(body)
	container.add(input);
	container.add(footer);

	return { 
		Display:container,
		previousPage
	}
}



