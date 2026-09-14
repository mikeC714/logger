import { createCliRenderer } from "@opentui/core";
import { CONFIG } from "./config.ts";
import { HomePage } from "./pages/home.ts";
import { Log } from "../app/log.ts";

export async function buildTUI(destroy: boolean | null = null, log:Log | null) {
	const main = await createCliRenderer({ ...CONFIG });
	if (destroy === true) {
		main.destroy();
		return;
	}
	
	if(log === null) throw new Error("Log parameter is null.");

	const { Home, isOverlayOpen, cancelOverlay, openCreate, openDelete, openSearch } = HomePage(main, log);

	main.keyInput.on("keypress", (key: any) => {
		if (isOverlayOpen()) {
			if (key.name === "escape") cancelOverlay();
			return; 
		}

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
		}
	});
	main.root.add(Home);
}
