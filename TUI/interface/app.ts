import { BoxRenderable } from "@opentui/core";
import { HomePage } from "./pages/home.ts";
import { DisplayPage } from "./pages/display.ts";
import type { Log } from "../app/log.ts";


export function App(main:any, log:Log){
	let current;
	const container = new BoxRenderable(main,{
		id:"app"
	});
	main.root.add(container);

	const home = HomePage(main, log, { onOpen: (key) => show("display", key) });
	const display = DisplayPage(main, log, { onBack: () => show("home") });


	function show(page: "home" | "display", value?:string){
		container.remove(home.Home);
		container.remove(display.Display);
		
		if(page === "home"){
			display.setActive(false);
			current = home.Home;
			container.add(home.Home);
			home.setActive(true);
		}else{
			home.setActive(false);
			display.setValue(value!);
			current = display.Display;
			container.add(display);
			display.setActive(true);
		};
	};

	show("home");
	
	return {
		show
	}

}
