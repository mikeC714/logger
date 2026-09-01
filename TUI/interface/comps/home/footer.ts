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

export function Footer(main:any){
	const container = new BoxRenderable(main, {
		id:"footer"
	});
	container.add(new TextRenderable(main, { content: "[c] create [d] delete [/] search" }));

	const errorCounter = new TextRenderable(main, { id:"errorCount", content: "0 errors"})
	const warnCounter = new TextRenderable(main, { id:"warnCount", content: "0 warnings"})
	const countBox = new BoxRenderable(main, { flexDirection:"row", gap: 2 });

	countBox.add(errorCounter);
	countBox.add(warnCounter);
	container.add(countBox);

	function updateErrorCount(err:number){
		errCount.set(err);
		const currCount = errCount.get().count;
		errorCounter.content = `${currCount} errors`;

		main.requestRender();
	};
	function updateWarnCount(warn:number){
		warnCount.set(warn);
		const currCount = warnCount.get().count;
		warnCounter.content = `${currCount} warnings`

		main.requestRender();
	};

	return{
		footer: container,
		setErrCount:updateErrorCount,
		setWarnCount:updateWarnCount
	}
};




