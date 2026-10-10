type MAIN_FOOTER_MODE = "normal" | "create" | "delete" | "search" | any;
type MAIN_HINTS = Record<MAIN_FOOTER_MODE, string>;

type DISPLAY_FOOTER_MODE = "normal" | "refresh" | "search" | any;
type DISPLAY_HINTS = Record<DISPLAY_FOOTER_MODE, string>;

export { MAIN_HINTS, MAIN_FOOTER_MODE, DISPLAY_FOOTER_MODE, DISPLAY_HINTS };
