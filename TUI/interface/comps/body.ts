import { BoxRenderable, ScrollBoxRenderable, TextTableRenderable, fg } from "@opentui/core";
import { PALETTE } from "../palette.ts";
import { LOG_COLUMNS } from "../../app/log.ts";
import type { LOG_ENTRY } from "../../types/log.d.ts"

function headerRow() {
	return LOG_COLUMNS.map((col:any) => [fg(PALETTE.text)(col)]);
};

function levelColor(level:string){
	switch(level){
		case "info":
			return PALETTE.msgColor.info;
		case "good":
			return PALETTE.msgColor.good;
		case "warn":
			return PALETTE.msgColor.warn;
		case "error":
			return PALETTE.msgColor.error;
		case "fatal":
			return PALETTE.msgColor.fatal;
		case "debug": 
			return PALETTE.msgColor.debug
		default:
			return PALETTE.text;
	};
}

function dataRow(entry:any) {
	return [
		[fg(PALETTE.text)(entry.created_at)],
		[fg(levelColor(entry?.level))(entry.msg)],
		[fg(PALETTE.text)(Object.entries(entry.meta)
						 .map(([k, v]) => `${k} : ${v}`)
						 .join(" ")
		)],
	];
}

export function Body(main: any) {
	const container = new BoxRenderable(main, {
		id: "body",
		flexGrow: 1,
		height: "100%",
		border: true,
		borderColor: PALETTE.border,
		focusedBorderColor: PALETTE.text,
		title: "select a log",
		titleAlignment: "left",
		flexDirection: "column",
	});

	const scrollBox = new ScrollBoxRenderable(main, {
		id: "body-scroll",
		width: "100%",
		height: "100%",
		border: false,
		scrollY: true,
		scrollX: false,
		stickyScroll: false,
	});

	const table = new TextTableRenderable(main, {
		id: "body-table",
		width: "100%",
		showBorders: true,
		outerBorder: false,
		selectable: false,
		borderColor: PALETTE.border,
		content: [headerRow()],
	});

	scrollBox.content.add(table);
	container.add(scrollBox);

	function showLog(projectKey: string, entries: Array<LOG_ENTRY>) {
		container.title = `${projectKey}: recent entries (${entries.length})`;
		table.content = [headerRow(), ...entries.map((entry) => dataRow(entry))];
		scrollBox.scrollTop = 0;
	};
	function unhide(secret:string){
		container.title = `${secret}`;
	}

	function showEmpty() {
		container.title = "select a log";
		table.content = [];
	};

	return { body:container, unhide, showLog, showEmpty };
}
