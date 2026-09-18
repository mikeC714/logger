import { BoxRenderable } from "@opentui/core";
import { HomePage } from "./pages/home.ts";
import { DisplayPage } from "./pages/display.ts";
import type { Log } from "../app/log.ts";


export function App(main:any, log:Log){
	const container = new BoxRenderable(main,{
		id:"app"
	});
	const { Home, currModeValues, openCreate, openDelete, openSearch } = HomePage(main, log);


	switch(currModeValues.mode){
		case "preview":
			container.add(Home)
		break;
		case "display":
			const { Display, previousPage } = DisplayPage(main, log, currModeValues?.value as string)
			container.remove(Home);
			container.add(Display)
	}
	



	return {
		container,
	}

}
