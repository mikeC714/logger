import { BoxRenderable, TextRenderable, InputRenderable, InputRenderableEvents } from "@opentui/core";
import { PALETTE } from "../palette.ts";

export type OverlayMode = "create" | "delete" | "search";

export interface OverlayCallbacks {
	onSubmit: (mode: OverlayMode, value: string) => void;
	onCancel: (mode: OverlayMode) => void;
}

export function Overlay(main: any, callbacks: OverlayCallbacks) {
	const container = new BoxRenderable(main, {
		id: "overlay",
		position: "absolute",
		left: "20%",
		top: "40%",
		width: "60%",
		height: 5,
		border: true,
		borderColor: PALETTE.border,
		backgroundColor: PALETTE.bg,
		titleAlignment: "left",
		flexDirection: "column",
		padding: 1,
		zIndex: 100,
		visible: false,
	});

	const promptText = new TextRenderable(main, { id: "overlay-prompt", content: "", fg: PALETTE.text });
	const input = new InputRenderable(main, { id: "overlay-input", width: "100%", value: "" });
	const hintText = new TextRenderable(main, {
		id: "overlay-hint",
		content: "Enter to confirm  ·  Esc to cancel",
		fg: PALETTE.border,
	});

	container.add(promptText);
	container.add(input);
	container.add(hintText);

	let mode: OverlayMode | null = null;
	let deleteTarget: string | null = null;

	function open(nextMode: OverlayMode, target?: string) {
		mode = nextMode;
		deleteTarget = nextMode === "delete" ? target ?? null : null;
		input.value = "";
		hintText.content = "Enter to confirm  ·  Esc to cancel";
		hintText.fg = PALETTE.border;

		switch (nextMode) {
			case "create":
				container.title = "Create log";
				input.placeholder = "logName";
				break;
			case "delete":
				container.title = "Delete log";
				input.placeholder = deleteTarget ?? "";
				break;
			case "search":
				container.title = "Search logs";
				input.placeholder = "search text";
				break;
		}

		container.visible = true;
		input.focus();
	}

	function close() {
		input.blur();
		container.visible = false;
		mode = null;
		deleteTarget = null;
	}

	function isOpen(): boolean {
		return mode !== null;
	}

	function cancel() {
		if (!mode) return;
		const finishedMode = mode;
		close();
		callbacks.onCancel(finishedMode);
	}

	input.on(InputRenderableEvents.ENTER, () => {
		if (!mode) return;
		const value = input.value.trim();

		if (mode === "delete" && value !== deleteTarget) {
			hintText.content = "Name doesn't match — try again, or Esc to cancel";
			hintText.fg = PALETTE.msgColor.fatal;
			input.value = "";
			return;
		}

		const finishedMode = mode;
		close();
		callbacks.onSubmit(finishedMode, value);
	});

	return { container, open, close, isOpen, cancel };
}
