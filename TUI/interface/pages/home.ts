import { BoxRenderable } from "@opentui/core";	 
import { main } from "../main.ts";
import { SearchBar } from "../comps/home/searchbar.ts";
import { SideBar } from "../comps/home/sidebar.ts";
import { Body } from "../comps/home/body.ts";
import { Footer } from "../comps/home/footer.ts";


export function HomePage(paths:Map<string,string>){
	let hoverData:string | null = "";

	const { searchBarContainer, searchResults } = SearchBar(paths);
	const sideBar = SideBar(main, paths, searchResults, (path:string | null) => hoverData = path);
	const body = Body(hoverData);
	const { footer, setErrCount, setWarnCount } = Footer(main);

	const headerContent = new BoxRenderable(main, {
		id:"headerContent"
	});
	headerContent.add(searchBarContainer);

	const mainContent = new BoxRenderable(main, {
		id:"mainContent"
	});
	mainContent.add(sideBar);
	mainContent.add(body);

	const footerContent = new BoxRenderable(main, {
		id:"footerContent"
	});
	footerContent.add(footer);

	const container = new BoxRenderable(main, {
		id:"homePage"
	});
	container.add(headerContent);
	container.add(mainContent);
	container.add(footerContent);

	return{
		Home:container,
		setErr:setErrCount,
		setWarn:setWarnCount
	};
};
