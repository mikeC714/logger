import { createCliRenderer, InputRenderable, InputRenderableEvents, KeyEvent } from "@opentui/core";	
import { CONFIG } from "./config.ts";
import { HomePage } from "./pages/home.ts";
import { Folder } from "../main/folder.ts";


export const main = await createCliRenderer({ ...CONFIG });

export async function buildTUI(){ 
	const log = new Folder();
	main.root.add(HomePage);
}
