import { createCliRenderer } from "@opentui/core";
import { CONFIG } from "./config.ts";
import { App } from "./app.ts";
import { Log } from "../app/log.ts";


export async function buildTUI(destroy: boolean | null = null, log:Log) {
	const main = await createCliRenderer({ ...CONFIG });
	if (destroy === true) {
		main.destroy();
		return;
	}
	const { container } = App(main, log);

	main.root.add(container);

}
