import { createCliRenderer } from "@opentui/core"; 
import { MAIN } from "./main.ts";



export const renderer = await createCliRenderer({
	exitOnCtrlC:true,
	targetFps:20,
})



function init(MAIN:any){
	return new Promise((res) => {
		res(renderer.root.add(MAIN))
	})
}

