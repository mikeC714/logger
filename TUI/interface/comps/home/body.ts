import { main } from "../../main.ts";
import { BoxRenderable, InputRenderable, InputRenderableEvents, t, bold, Box } from "@opentui/core";

export function Body(hoverData:string){
	// use the given hoverData (path)
	// in order to fetch the data regarding to said path
	// when previewing (HOVERING) the most recent logs will be shown (around 20-40 entries if there are previous entries)

	const container = new BoxRenderable(main, {
		id:"container",
	});

	return container;
};

