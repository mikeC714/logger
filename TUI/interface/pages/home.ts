import { BoxRenderable } from "@opentui/core";
import { SideBar } from "../comps/sidebar.ts";
import { Body } from "../comps/body.ts";
import { Footer } from "../comps/footer.ts";
import { Overlay } from "../comps/input.ts";
import type { Log } from "../../app/log.ts";
import type { MAIN_HINTS } from "../../types/hints.d.ts";


const HINTS:MAIN_HINTS = {
	normal: "[n] create   [d] delete   [r] refresh   [/] search",
	create: "CREATE — type a logName, Enter to confirm, Esc to cancel",
	delete: "DELETE — retype the logName to confirm, Esc to cancel",
	search: "SEARCH — type a filter, Enter to apply, Esc to cancel",
};

type HomeCallbacks = { onOpen: (projectKey:string) => void }

export function HomePage(main:any, log:Log, { onOpen }: HomeCallbacks) {
	let currentQuery = "";
	let currHovered = "";
	let active = true;

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

	const sideBar = SideBar(
		main, 
		log.list(), 
		(projectKey:string | null, mode:string | null) => {
			if(mode === "display"){
				if(projectKey) onOpen(projectKey);
				return;
			}
			handleHover(projectKey)
		}
	);

	const body = Body(main);
	const { footer, showWarnErrorCount, setMode: setFooterMode } = Footer(main, HINTS);
	const { input, open, isOpen, close, cancel } = Overlay(main, {
		onSubmit: (mode, value) => {
			currHovered = value;
			handleOverlaySubmit(mode, value) 
		},
		onCancel: () => handleOverlayCancel(),
	});

	function handleHover(projectKey: string | null) {
		if (!projectKey) {
			body.showEmpty();
			return;
		};
		log.preview(projectKey).then((entries:any) => body.showLog(projectKey, entries));
		log.getLogErrorAndWarnCount(projectKey).then((count:any) => showWarnErrorCount(count));	
	};

	async function refreshSidebar() {
		const visible = await log.filter(currentQuery);
		sideBar.setNames(visible, log.list().length);
		if (visible.length === 0) body.showEmpty();
	}

	function returnToNormal() {
		setFooterMode("normal");
		close();
		sideBar.focus();
	}

	function handleOverlayCancel() {
		returnToNormal();
	}

	function handleOverlaySubmit(mode:any, value: string) {
		switch (mode) {
			case "create":
				log.create(value).then(() => {
					refreshSidebar();
					returnToNormal();
				});
			break;
			case "delete": 
				const indexBeforeDelete = sideBar.getSelectedIndex();
				 log.delete(value).then(() => {
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
		open("create");
	}
	function openDelete() {
		const target = sideBar.getHovered();
		if (!target) return; 
		setFooterMode("delete");
		open("delete", target);
	}
	function openSearch() {
		setFooterMode("search");
		open("search");
	}
	function refresh(){
		 log.preview(currHovered);	
	}

	main.keyInput.on("keypress", (key: any) => {
		if(!active) return;
		if (isOpen()) {
			if (key.name === "escape") cancel();
			return; 
		}
		switch (key.name) {
			case "n": openCreate(); break;
			case "d": openDelete(); break;
			case "r": refresh(); break; 
			case "/": openSearch(); break;
		};

	});

	mainContent.add(sideBar.container);
	mainContent.add(body.container);
	container.add(mainContent);
	container.add(footer);
	container.add(input);

	return {
		Home: container,
		setActive(value:boolean){
			active = value;
			if(value) sideBar.focus();
		}
	};
}
