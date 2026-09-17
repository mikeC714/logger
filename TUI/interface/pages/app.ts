import { BoxRenderable } from "@opentui/core";
import { SideBar } from "../comps/sidebar.ts";
import { Body } from "../comps/body.ts";
import { Footer } from "../comps/footer.ts";
import { Overlay } from "../comps/input.ts";
import { Methods } from "../methods.ts";
import { Display } from "./display.ts";
import type { Log } from "../../app/log.ts";
import type { MAIN_HINTS } from "../../types/hints.d.ts";


const HINTS:MAIN_HINTS = {
	normal: "[n] create   [d] delete   [/] search",
	create: "CREATE — type a logName, Enter to confirm, Esc to cancel",
	delete: "DELETE — retype the logName to confirm, Esc to cancel",
	search: "SEARCH — type a filter, Enter to apply, Esc to cancel",
};

export function App(main:any, log:Log) {
	const methods = new Methods(log);
	let currentQuery = "";
	let inDisplay = false;
	let displayPage:any;

	const mainContent = new BoxRenderable(main, {
		id: "mainContent",
		width: "100%",
		flexGrow: 1,
		flexDirection: "row",
	});
	const container = new BoxRenderable(main, {
		id: "homePage",
		width: "100%",
		height: "100%",
		flexDirection: "column",
	});

	const sideBar = SideBar(main, log.list(), (projectKey:string | null, mode?:string) => handleHover(projectKey, mode));
	const body = Body(main);
	const { footer, showWarnErrorCount, setMode: setFooterMode } = Footer(main, HINTS);

	const input = Overlay(main, {
		onSubmit: (mode, value) => handleOverlaySubmit(mode, value),
		onCancel: () => handleOverlayCancel(),
	});

	mainContent.add(sideBar.container);
	mainContent.add(body.container);
	container.add(mainContent);
	container.add(footer);
	container.add(input.container);

	function handleHover(projectKey: string | null, mode?:string) {
		if(mode === undefined) return;
		if (!projectKey) {
			body.showEmpty();
			return;
		}
		switch (mode){
			case "preview":
			log.preview(projectKey)
					.then((entries:any) => {
						body.showLog(projectKey, entries);
					});
			log.getLogErrorAndWarnCount(projectKey)
					.then((count:any) => {
						showWarnErrorCount(count)	
					})
			break;
			case "display":
				inDisplay = true;
				displayPage = Display(main, log, projectKey);
			break;
		}
	};

	async function refreshSidebar() {
		const visible = await log.filter(currentQuery);
		sideBar.setNames(visible, log.list().length);
		if (visible.length === 0) body.showEmpty();
	}

	function returnToNormal() {
		setFooterMode("normal");
		sideBar.focus();
	}

	function handleOverlayCancel() {
		returnToNormal();
	}

	function handleOverlaySubmit(mode:any, value: string) {
		switch (mode) {
			case "create":
				methods.create(value).then(() => {
					refreshSidebar();
					returnToNormal();
				});
			break;
			case "delete": 
				const indexBeforeDelete = sideBar.getSelectedIndex();
				 methods.delete(value).then(() => {
					refreshSidebar();
					sideBar.selectIndexClamped(indexBeforeDelete);
					returnToNormal();
				});
			break;
			case "search":
				currentQuery = value;
				refreshSidebar();
				returnToNormal();
			break;
		}
	}

	function openCreate() {
		setFooterMode("create");
		input.open("create");
	}
	function openDelete() {
		const target = sideBar.getHovered();
		if (!target) return; 
		setFooterMode("delete");
		input.open("delete", target);
	}
	function openSearch() {
		setFooterMode("search");
		input.open("search");
	}

	return {
		Home: container,
		isOverlayOpen: input.isOpen,
		cancelOverlay: input.cancel,
		openCreate,
		openDelete,
		openSearch,
		inDisplay,
		displayPage,
	};
}
