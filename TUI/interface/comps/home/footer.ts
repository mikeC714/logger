
import { BoxRenderable, TextRenderable } from "@opentui/core";
import { Count } from "../../utils/count.ts";
import { PALETTE } from "../../palette.ts";

class ErrCount extends Count {
	constructor() {
		super();
	}
}
class WarnCount extends Count {
	constructor() {
		super();
	}
}
const warnCount = new WarnCount();
const errCount = new ErrCount();

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

	// was hardcoded "[c] create ..." — the agreed shortcut is [n], and this
	// now swaps per active mode via setMode() instead of being static.
	const hintLabel = new TextRenderable(main, { id: "footerHint", content: HINTS.normal, fg: PALETTE.text });
	container.add(hintLabel);

	const errorCounter = new TextRenderable(main, { id: "errorCount", content: "0 errors", fg: PALETTE.bad });
	const warnCounter = new TextRenderable(main, { id: "warnCount", content: "0 warnings", fg: PALETTE.warn });
	const countBox = new BoxRenderable(main, { flexDirection: "row", gap: 2 });

	countBox.add(errorCounter);
	countBox.add(warnCounter);
	container.add(countBox);

	function updateErrorCount(err: number) {
		errCount.set(err);
		const currCount = errCount.get().count;
		errorCounter.content = `${currCount} errors`;
		main.requestRender();
	}
	function updateWarnCount(warn: number) {
		warnCount.set(warn);
		const currCount = warnCount.get().count;
		warnCounter.content = `${currCount} warnings`;
		main.requestRender();
	}

	function setMode(mode: FooterMode) {
		hintLabel.content = HINTS[mode];
	}

	return {
		footer: container,
		setErrCount: updateErrorCount,
		setWarnCount: updateWarnCount,
		setMode,
	};
}
