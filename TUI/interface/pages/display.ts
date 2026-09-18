import { LogTable } from "../comps/table.ts";
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


type DisplayCallbacks = { onBack:() => void };
export function DisplayPage(main:any, log:Log, { onBack }:DisplayCallbacks){
	let projectKey: string | null = null;
	let active = false;

	const container = new BoxRenderable(main,{
		id:"displayContainer",
		width:"100%",
		height:"100%",
		flexDirection:"column",
	});

	const table = LogTable(main, projectKey!);
	const { footer, showWarnErrorCount, setMode } = Footer(main, HINTS);		
	const input = Overlay(main, {
		onSubmit:(_, value) => handleOverlaySubmit(value),
		onCancel: () => handleOverlayCancel()
	});

	async function load(query = ""){
		const key = projectKey;
		if(!key) return;
		const logs = query
			? await log.filterLog(key, query)
			: await log.getAllLogs(key);
		if(key !== projectKey) return;
		table.showLog(key, logs as any)
	}

	function setValue(key:string){
		projectKey = key;
		setMode("normal");
		load();
		log.getLogErrorAndWarnCount(key).then((count:any) => {
			if(key === projectKey) showWarnErrorCount(count);
		})
	}

	function openSearch(){
		setMode("search");
		input.open("search");
	};

	function handleOverlaySubmit(value:string){
		load(value.trim());
		setMode("normal");
	};

	function handleOverlayCancel(){
		setMode("normal");
	};

	main.keyInput.on("keypress", (key: any) => {
		if (input.isOpen()) {
			if (key.name === "escape") input.cancel();
			return; 
		}
			if(!active) return;
			if(input.isOpen()){
				if(key.name === "escape") input.cancel();
				return;
			}
			switch (key.name) {
				case "r": load(); break;
				case "/": openSearch(); break;
				case "escape": onBack(); break;
			};
	});

	container.add(table)
	container.add(input);
	container.add(footer);

	return { 
		Display:container,
		setValue,
		setActive(value:boolean){ active = value }
	}
}



