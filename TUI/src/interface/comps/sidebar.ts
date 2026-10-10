import { BoxRenderable, SelectRenderable, SelectRenderableEvents } from "@opentui/core";
import { PALETTE } from "../palette.ts";

export function SideBar(main: any, initialNames: Array<string> | Array<[string, string]>, onHover: (name: string | null, mode:string | null) => void) {
	const container = new BoxRenderable(main, {
		id: "sideBar",
		width: "30%",
		height: "100%",
		border: true,
		borderColor: PALETTE.border,
		focusedBorderColor: PALETTE.text,
		title: "logs 0/0",
		titleAlignment: "left",
		flexDirection: "column",
	});

	let visible: Array<[string, string]> = [];

	const select = new SelectRenderable(main, {
		id: "sideBar-select",
		width: "100%",
		height: "100%",
		backgroundColor: PALETTE.bg,
		textColor: PALETTE.text,
		focusedBackgroundColor: PALETTE.bg,
		focusedTextColor: PALETTE.text,
		selectedBackgroundColor: PALETTE.text,
		selectedTextColor: PALETTE.bg,
		showDescription: false,
		showSelectionIndicator: true,
		showScrollIndicator: true,
		wrapSelection: false,
		options: [],
		onMouseScroll: (event: any) => {
			if (!event.scroll) return;
			if (event.scroll.direction === "down") select.moveDown();
			else if (event.scroll.direction === "up") select.moveUp();
		},
	});

	select.on(SelectRenderableEvents.SELECTION_CHANGED, (_index: number, option: { value?: unknown } | null) => {
		onHover(option ? String(option.value) : null, "preview");
	});

	select.on(SelectRenderableEvents.ITEM_SELECTED, (_index: number, option: { value?: unknown } | null) => {
		onHover(option ? String(option.value) : null, "display");
	});


	container.add(select);

	function setNames(names:Array<[string, string]>, total: number) {
		visible = names;
		select.options = names.map(([name, _]) => ({ name, description: "", value: name }));
		container.title = `logs ${names.length}/${total}`;
		if (names.length > 0) {
			select.setSelectedIndex(0);
		} else {
			onHover(null, null);
		}
	}

	function getHovered(): string | null {
		if (visible.length === 0) return null;
		const opt = select.getSelectedOption();
		return opt ? String(opt.value) : null;
	}

	function selectIndexClamped(index: number) {
		if (visible.length === 0) return;
		const clamped = Math.max(0, Math.min(index, visible.length - 1));
		select.setSelectedIndex(clamped);
	}

	function getSelectedIndex(): number {
		return select.getSelectedIndex();
	}

	function focus() {
		select.focus();
	}

	if (initialNames.length > 0) {
		setNames(initialNames, initialNames.length);
	}

	return { container, setNames, getHovered, selectIndexClamped, getSelectedIndex, focus };
}


