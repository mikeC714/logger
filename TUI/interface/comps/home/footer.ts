import { BoxRenderable, TextRenderable, t, bold } from "@opentui/core";
import { Count } from "../../utils/count.ts";

class ErrCount extends Count{
	constructor(){
		super();
	}
}
class WarnCount extends Count{
	constructor(){
		super();
	}
}
const warnCount = new WarnCount();
const errCount = new ErrCount();

export function Footer(render:any){
	const container = new BoxRenderable(render, {
		id:"footer"
	});
	container.add(new TextRenderable(render, { content: "[c] create [d] delete [/] search" }));

	const errorCounter = new TextRenderable(render, { id:"errorCount", content: "0 errors"})
	const warnCounter = new TextRenderable(render, { id:"warnCount", content: "0 warnings"})
	const countBox = new BoxRenderable(render, { flexDirection:"row", gap: 2 });

	countBox.add(errorCounter);
	countBox.add(warnCounter);
	container.add(countBox);

	function updateErrorCount(err:number){
		errCount.set(err);
		const currCount = errCount.get().count;
		errorCounter.content = `${currCount} errors`;

		render.requestRender();
		return errorCounter;
	};
	function updateWarnCount(warn:number){
		warnCount.set(warn);
		const currCount = warnCount.get().count;
		warnCounter.content = `${currCount} warnings`

		render.requestRender();
		return warnCounter;
	};

	return{
		footer: container,
		setErrCount:updateErrorCount,
		setWarnCount:updateWarnCount
	}
};




