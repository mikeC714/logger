import { createCliRenderer } from "@opentui/core";
import { CONFIG } from "./config.ts";
import { App } from "./pages/app.ts";
import { Log } from "../app/log.ts";


export async function buildTUI(destroy: boolean | null = null, log:Log | null) {
	const main = await createCliRenderer({ ...CONFIG });
	if (destroy === true) {
		main.destroy();
		return;
	}
	
	if(log === null) throw new Error("Log parameter is null.");

	const { Home, isOverlayOpen, cancelOverlay, openCreate, openDelete, openSearch, inDisplay, displayPage } = App(main, log);
	main.root.add(Home);

	main.keyInput.on("keypress", (key: any) => {
		if (isOverlayOpen()) {
			if (key.name === "escape") cancelOverlay();
			return; 
		}

	if(inDisplay){
		const { display, search, refresh } = displayPage;
		main.root.remove(Home);
		main.root.add(display);

		switch (key.name) {
			case "/":
				search();
			break;
			case "|":
				refresh();
			break;
		}
	};

		switch (key.name) {
			case "n":
				openCreate();
			break;
			case "d":
				openDelete();
			break;
			case "/":
				openSearch();
			break;
		};

	});
}
