import { createCliRenderer } from "@opentui/core";	
import { CONFIG } from "./config.ts";
import { HomePage } from "./pages/home.ts";
import { Folder } from "../app/folder.ts";
import { Input } from "./comps/home/input.ts";
 

type TYPE = "" | "create" | "delete" | "search"; 

export async function buildTUI(destroy:boolean | null = null){ 
	const main = await createCliRenderer({ ...CONFIG });
	if(destroy === true){
		main.destroy();
		return;
	};

	const folder = new Folder();
	const { Home, setErr, setWarn } = HomePage(main, folder.data());

	let type:TYPE = "";
	main.keyInput.on("keypress", (key:any) => {
		switch(key){
			case(key.ctrl && "n"):
				type = "create";
			break;
			case(key.crtl && "d"):
				type = "delete";
			break;
			case(key.ctrl && "/"):
				type = "search";
			break;
		}
	})

	const input = Input(type, main);
	main.root.add(Home);
	main.root.add(input)
	main.root.add
};
