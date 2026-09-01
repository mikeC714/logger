import { BoxRenderable, InputRenderable, InputRenderableEvents, t, bold, Box } from "@opentui/core";


export function SearchBar(main:any, paths:() => ReadonlyMap<string, string>){
	const searchBarContainer = new BoxRenderable(main, {
		id:"searchBar"
	});
	const input = new InputRenderable(main, {
		id:"input",
		placeholder:"Search For Log..."
	});

	let results:any = null;
	input.on(InputRenderableEvents.ENTER, (value:string) => {
		results = [];
		for(const [key, _] of paths.entries()){
			if(key .toLowerCase().trim().includes(value.trim().replace(/\s+/g, " ").toLowerCase())){
				results.push(key);
			};
		};
	});
	searchBarContainer.add(input);

	return {
		searchBarContainer,
		searchResults: results
	};
}	
