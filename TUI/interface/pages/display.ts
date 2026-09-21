import { LogTable } from "../comps/table.ts";
import { Footer } from "../comps/footer.ts";
import { Overlay } from "../comps/input.ts";
import { BoxRenderable } from "@opentui/core";
import { Log } from "../../app/log.ts";
import type { DISPLAY_HINTS } from "../../types/hints.d.ts";
import type { LOG_ENTRY } from "../../types/log.d.ts";

const HINTS:DISPLAY_HINTS = {
	normal: "[r] refresh  [/] search",
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

	const { table, showLog, showEmpty } = LogTable(main, projectKey!);
	const { footer, showWarnErrorCount, setMode } = Footer(main, HINTS);		
	const { input, open, close, isOpen, cancel } = Overlay(main, {
		onSubmit:(_, value) => handleOverlaySubmit(value),
		onCancel: () => handleOverlayCancel()
	});

	async function load(query = ""){
		const key = projectKey;
		if(!key) return;
		try{
			const logs:Array<LOG_ENTRY> | any = query
				? await log.filterLog(key, query)
				: await log.getAllLogs(key);

			if(logs?.length === 0 || logs === undefined) showEmpty(key); 

			showLog(key, logs)
			main.requestRender();
		}catch(e){
			console.error(`FAILURE:${e}`);
			throw e;
		}
	};

	function setValue(key:string){
		projectKey = key;
		setMode("normal");
		load();
		log.getLogErrorAndWarnCount(key).then((count:any) => {
			if(key === projectKey) showWarnErrorCount(count);
		})
	};

	function openSearch(){
		setMode("filter");
		open("filter");
	};

	function handleOverlaySubmit(value:string){
		load(value.trim());
		setMode("normal");
	};

	function handleOverlayCancel(){
		setMode("normal");
		close();
	};

	main.keyInput.on("keypress", (key: any) => {
		if (isOpen()) {
			if (key.name === "escape") cancel();
			return; 
		}
			if(!active) return;
			if(isOpen()){
				if(key.name === "escape") cancel();
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



