import { createCliRenderer } from "@opentui/core";
import { CONFIG } from "./config.ts";
import { App } from "./app.ts";
import { Log } from "../app/log.ts";


export async function buildTUI(log:Log, user:string) {
	const main = await createCliRenderer({ ...CONFIG });
	const { show } = App(main, log, user);
	return {
		main,
		show,
		destroy: () => main.destroy()
	}
}
