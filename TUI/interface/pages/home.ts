import { BoxRenderable } from "@opentui/core";
import { SideBar } from "../comps/home/sidebar.ts";
import { Body } from "../comps/home/body.ts";
import { Footer } from "../comps/home/footer.ts";
import { Overlay, type OverlayMode } from "../comps/home/input.ts";
import { Methods } from "../methods.ts";
import type { Log } from "../../app/log.ts";

export function HomePage(main: any, log: Log) {
	const methods = new Methods(log);
	let currentQuery = "";

	const sideBar = SideBar(main, log.list(), (name) => handleHoverChange(name));
	const body = Body(main);
	const { footer, setErrCount, setWarnCount, setMode: setFooterMode } = Footer(main);

	const overlay = Overlay(main, {
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

	function refreshSidebar() {
		const visible = log.filter(currentQuery);
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

	function handleOverlaySubmit(mode: OverlayMode, value: string) {
		switch (mode) {
			case "create":
				void methods.create(value).then(() => {
					refreshSidebar();
					returnToNormal();
				});
				break;

			case "delete": {
				const indexBeforeDelete = sideBar.getSelectedIndex();
				void methods.delete(value).then(() => {
					refreshSidebar();
					sideBar.selectIndexClamped(indexBeforeDelete);
					returnToNormal();
				});
				break;
			}

			case "search":
				currentQuery = value;
				refreshSidebar();
				returnToNormal();
				break;
		}
	}

	function openCreate() {
		setFooterMode("create");
		overlay.open("create");
	}
	function openDelete() {
		const target = sideBar.getHovered();
		if (!target) return; // nothing to delete
		setFooterMode("delete");
		overlay.open("delete", target);
	}
	function openSearch() {
		setFooterMode("search");
		overlay.open("search");
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
	container.add(overlay.container);

	return {
		Home: container,
		setErr: setErrCount,
		setWarn: setWarnCount,
		isOverlayOpen: overlay.isOpen,
		cancelOverlay: overlay.cancel,
		openCreate,
		openDelete,
		openSearch,
	};
}
