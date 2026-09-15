
import { BoxRenderable, TextRenderable } from "@opentui/core";
import { PALETTE } from "../palette.ts";


export type FooterMode = "normal" | "create" | "delete" | "search";

const HINTS: Record<FooterMode, string> = {
	normal: "[n] create   [d] delete   [/] search",
	create: "CREATE — type a logName, Enter to confirm, Esc to cancel",
	delete: "DELETE — retype the logName to confirm, Esc to cancel",
	search: "SEARCH — type a filter, Enter to apply, Esc to cancel",
};

export function Footer(main: any) {
	const container = new BoxRenderable(main, {
		id: "footer",
		width: "100%",
		border: false,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingLeft: 1,
		paddingRight: 1,
	});

	const hintLabel = new TextRenderable(main, { id: "footerHint", content: HINTS.normal, fg: PALETTE.text });
	container.add(hintLabel);

	const fatalCounter = new TextRenderable(main, { id: "fatalCount", content: "0 fatals", fg: PALETTE.msgColor.fatal });
	const errorCounter = new TextRenderable(main, { id: "errorCount", content: "0 errors", fg: PALETTE.msgColor.error });
	const warnCounter = new TextRenderable(main, { id: "warnCount", content: "0 warnings", fg: PALETTE.msgColor.warn });
	const countBox = new BoxRenderable(main, { flexDirection: "row", gap: 2 });

	countBox.add(fatalCounter);
	countBox.add(errorCounter);
	countBox.add(warnCounter);
	container.add(countBox);



	function showWarnErrorCount(count:any){
		errorCounter.content = `${count?.error} errors`;
		warnCounter.content = `${count?.warn} warnings`;
		fatalCounter.content = `${count?.fatal} fatals`
	}


	function setMode(mode: FooterMode) {
		hintLabel.content = HINTS[mode];
	}

	return {
		footer: container,
		showWarnErrorCount,
		setMode,
	};
}
