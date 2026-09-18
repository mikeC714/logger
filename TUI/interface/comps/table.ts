import { ScrollBoxRenderable, BoxRenderable, TextTableRenderable, fg } from "@opentui/core";
import { LOG_COLUMNS } from "../../app/log.ts";
import { PALETTE } from "../palette.ts";
import type { LOG_ENTRY } from "../../types/log.d.ts";

export function LogTable(main:any, projectKey:string){
	const container = new BoxRenderable(main, {
		id: "logTableContainer",
		flexGrow: 1,
		height: "100%",
		border: true,
		borderColor: PALETTE.border,
		focusedBorderColor: PALETTE.text,
		title: projectKey,
		titleAlignment: "left",
		flexDirection: "column",
	});

	const scrollBox = new ScrollBoxRenderable(main, {
		id: "logTableScroll",
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
		content: [headerFormat()],
	});

	scrollBox.content.add(table);
	container.add(scrollBox);

	function headerFormat(){
		return LOG_COLUMNS.map((c:any) => [fg(PALETTE.text)(c)])
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
	};

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

	function showLog(projectKey: string, entries: Array<LOG_ENTRY>) {
		container.title = `${projectKey}: recent entries (${entries.length})`;
		table.content = [headerFormat(), ...entries.map((entry) => dataRow(entry))];
		scrollBox.scrollTop = 0;
	};

	function showEmpty() {
		container.title = "select a log";
		table.content = [];
	};

	return { container, showLog, showEmpty };
}
