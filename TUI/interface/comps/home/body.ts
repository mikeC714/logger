import { BoxRenderable, ScrollBoxRenderable, TextTableRenderable, fg } from "@opentui/core";
import { PALETTE } from "../../palette.ts";
import { LOG_COLUMNS, type LogEntry } from "../../../app/log.ts";

function headerRow() {
	return LOG_COLUMNS.map((col:any) => [fg(PALETTE.text)(col)]);
}

function dataRow(entry: LogEntry) {
	return [entry.id, entry.msg, entry.metaData, entry.timestamp].map((v) => [fg(PALETTE.text)(v)]);
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

	function showLog(name: string, entries: LogEntry[]) {
		container.title = `${name}: recent entries (${entries.length})`;
		table.content = [headerRow(), ...entries.map(dataRow)];
		scrollBox.scrollTop = 0;
	}

	function showEmpty() {
		container.title = "select a log";
		table.content = [];
	}

	return { container, showLog, showEmpty };
}
