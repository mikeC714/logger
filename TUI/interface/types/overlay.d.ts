type OVERLAY_MODE = "create" | "delete" | "search";

interface OVERLAY_CALLBACKS {
	onSubmit: (mode: OVERLAY_MODE, value: string) => void;
	onCancel: (mode: OVERLAY_MODE) => void;
}

export { OVERLAY_MODE, OVERLAY_CALLBACKS }
