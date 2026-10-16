import { ScrollBoxRenderable, BoxRenderable, TextTableRenderable, fg } from "@opentui/core";
import { PALETTE } from "../palette.ts";
import type { LOG_ENTRY } from "../../types/log.d.ts";



export const LOG_COLUMNS = ["Status", "Timestamp", "Message"] as const;

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
		flexDirection:"column",
		alignItems:"center",
	});

	const table = new TextTableRenderable(main, {
		id: "body-table",
		width: "100%",
		columnWidthMode:"content",
		showBorders: true,
		outerBorder: false,
		selectable: false,
		borderColor: PALETTE.border,
		justifyContent:"center",
		alignItems:"center",
		content: [headerFormat()],
	});

	function headerFormat() {
		return [
			[fg(PALETTE.text)(center("Status", 20))],
			[fg(PALETTE.text)(center("Timestamp", 40))],
			[fg(PALETTE.text)(center("Message", 254))],
		];
	};

	function center(text: string, width?: number) {
		const total = Math.max(0, width! - text.length);
		const left = Math.floor(total / 2);
		return " ".repeat(left) + text + " ".repeat(total - left);
	}

	function levelColor(level:string){
		switch(level){
			case "info": return PALETTE.msgColor.info;
			case "good": return PALETTE.msgColor.good;
			case "warn": return PALETTE.msgColor.warn;
			case "error": return PALETTE.msgColor.error;
			case "fatal": return PALETTE.msgColor.fatal;
			case "debug": return PALETTE.msgColor.debug
			default: return PALETTE.text;
		};
	};

	function dataRow(entry:any) {
		return [
			[fg(levelColor(entry?.level))(center(entry.level.toUpperCase(), 20))],
			[fg(PALETTE.text)(center(entry.created_at, 40))],
			[fg(PALETTE.text)(entry.msg)],
		];
	};

	function showLog(projectKey: string, entries: Array<LOG_ENTRY>) {
		container.title = `${projectKey}: (${entries.length})`;
		table.content = [headerFormat(), ...entries.map((entry) => dataRow(entry))];
		scrollBox.scrollTop = 0;
	};

	function showEmpty(projectKey:string) {
		container.title = `${projectKey}: 0`;
		table.content = [];
	};

	scrollBox.content.add(table);
	container.add(scrollBox);

	return { table:container, showLog, showEmpty };
}
