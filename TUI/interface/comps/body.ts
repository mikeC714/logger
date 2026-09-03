import { BoxRenderable, ScrollBoxRenderable, TextTableRenderable, fg } from "@opentui/core";
import { PALETTE } from "../palette.ts";
import { LOG_COLUMNS } from "../../app/log.ts";
import type { LOG_ENTRY } from "../../types/log.d.ts"
import type { META_BODY } from "../../types/meta.d.ts";

function headerRow() {
	return LOG_COLUMNS.map((col:any) => [fg(PALETTE.text)(col)]);
};

function formatMetaData(meta: META_BODY): string {
	const parts = [
		meta.role && `role=${meta.role}`,
		meta.userId && `user=${meta.userId}`,
		meta.username && `user=${meta.username}`,
		meta.timeStamp && `user=${meta.timeStamp}`,
		meta.version && `user=${meta.version}`,
		meta.enviroment && `env=${meta.enviroment}`,
		meta.errorStatus && `user=${meta.errorStatus}`,
		meta.errorCode && `err=${meta.errorCode}`,
	].filter(Boolean);
	return parts.length > 0 ? parts.join(" ") : "-";
}

function dataRow(entry: LOG_ENTRY) {
	return [
		String(entry.id),
		entry.msg,
		formatMetaData(entry.metaData),
		entry.timestamp.toISOString(),
	].map((v) => [fg(PALETTE.text)(v)]);
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

	function showLog(name: string, entries: Array<LOG_ENTRY>) {
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
