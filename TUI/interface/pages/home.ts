import { BoxRenderable } from "@opentui/core";
import { SideBar } from "../comps/sidebar.ts";
import { Body } from "../comps/body.ts";
import { Footer } from "../comps/footer.ts";
import { Overlay } from "../comps/input.ts";
import { Methods } from "../methods.ts";
import type { Log } from "../../app/log.ts";

export function HomePage(main:any, log:Log) {
	const methods = new Methods(log);
	let currentQuery = "";

	const sideBar = SideBar(main, log.list(), (name) => handleHoverChange(name));
	const body = Body(main);
	const { footer, setErrCount, setWarnCount, setMode: setFooterMode } = Footer(main);

	const input = Overlay(main, {
		onSubmit: (mode, value) => handleOverlaySubmit(mode, value),
		onCancel: () => handleOverlayCancel(),
	});

	function handleHoverChange(name: string | null) {
		if (!name) {
			body.showEmpty();
			return;
		}
		void log.readRecent(name).then((entries:any) => {
			body.showLog(name, entries);
		});
	}

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

	const mainContent = new BoxRenderable(main, {
		id: "mainContent",
		width: "100%",
		flexGrow: 1,
		flexDirection: "row",
	});
	mainContent.add(sideBar.container);
	mainContent.add(body.container);

	const footerContent = new BoxRenderable(main, { id: "footerContent", width: "100%" });
	footerContent.add(footer);

	const container = new BoxRenderable(main, {
		id: "homePage",
		width: "100%",
		height: "100%",
		flexDirection: "column",
	});
	container.add(mainContent);
	container.add(footerContent);
	container.add(input.container);

	return {
		Home: container,
		setErr: setErrCount,
		setWarn: setWarnCount,
		isOverlayOpen: input.isOpen,
		cancelOverlay: input.cancel,
		openCreate,
		openDelete,
		openSearch,
	};
}
