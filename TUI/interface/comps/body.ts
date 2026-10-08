import { BoxRenderable, ScrollBoxRenderable, TextTableRenderable, fg } from "@opentui/core";
import { PALETTE } from "../palette.ts";
import type { LOG_ENTRY } from "../../types/log.d.ts"


export const LOG_COLUMNS = ["Timestamp", "Message"] as const;

function center(text: string, width?: number) {
	const total = Math.max(0, width! - text.length);
	const left = Math.floor(total / 2);
	return " ".repeat(left) + text + " ".repeat(total - left);
}

function headerRow() {
	return [
		[fg(PALETTE.text)(center("Timestamp", 60))],
		[fg(PALETTE.text)(center("Message", 180))],
	];
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


function formatMeta(meta?: Record<string, unknown>) {
	if (!meta) return "";
	return Object.entries(meta)
		.map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
		.join("  ");
}

function dataRow(entry:any) {
	const meta = formatMeta(entry.meta);
	return [
		[fg(PALETTE.text)(entry.created_at)],
		[
			fg(levelColor(entry.level))(entry.msg),
			...(meta ? [fg(PALETTE.text)(`  ${meta}`)] : []),
		],
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
		wrapMode: "word",           
		columnFitter: "balanced",   
		columnWidthMode: "content",
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
