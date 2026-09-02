import { BoxRenderable, TextRenderable, t, bold, Box } from "@opentui/core";
import type { MouseEvent } from "@opentui/core";


export function SideBar(main:any, paths:ReadonlyMap<string, string>, searchResults: Array<Array<string>> | null, fn:(path:string | null) => void){
	const sideBarBox = new BoxRenderable(main, {
		id:"sideBar",
		flexDirection:"column"
	});
	const contentBox = new BoxRenderable(main,{
		id:"contentBox"
	});

	if(searchResults !== null){
		searchResults.map(([projectKey, path]) => {
			const logName = new TextRenderable(main, { id:"logName" });
			logName.content = projectKey as string;
			contentBox.add(logName);
		});
	}else{
		Array.from(paths).map(([projectKey, path]) => {
			const logName = new TextRenderable(main, { id:"logName" });
			logName.content = projectKey;
			contentBox.add(logName);
		})
	};

	function hover(){
		const list = new BoxRenderable(main, { flexDirection:"column" });
		Array.from(paths).map(([projectKey, path]) => {
			const row = new BoxRenderable(main,{
				height:1,
				onMouseOver(e:MouseEvent){
					fn(projectKey as string);
					main.requestRender();
				},
				onMouseOut(e:MouseEvent){
					fn(null);
					main.requestRender();
				}
			});
			row.add(new TextRenderable(main, { content: path }))
			list.add(row);
		})
		return list;
	};

	contentBox.add(hover());
	sideBarBox.add(contentBox);

	return sideBarBox
};








