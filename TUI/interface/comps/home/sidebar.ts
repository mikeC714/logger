import { BoxRenderable, TextRenderable, t, bold, Box } from "@opentui/core";
import type { MouseEvent } from "@opentui/core";


type SEARCH_RESULTS = Array<Record<string, {
	projectKey:string;
	path:string;
}>>


export function SideBar(render:any, paths:Map<string, string>, searchResults: SEARCH_RESULTS | null, fn:(path:string | null) => void){
		const sideBarBox = new BoxRenderable(render, {
			id:"sideBar",
			flexDirection:"column"
		});
		const contentBox = new BoxRenderable(render,{
			id:"contentBox"
		});

		if(searchResults !== null){
			searchResults.map((c:any) => {
				const logName = new TextRenderable(render, { id:"logName" });
				logName.content = c.logName;
				contentBox.add(logName);
			});
		}else{
			for(const [key, _] of paths){
				const logName = new TextRenderable(render, { id:"logName" });
				logName.content = key;
				contentBox.add(logName);
			}
		};

		function hover(){
			const list = new BoxRenderable(render, { flexDirection:"column" });

			for(const [key, path] of paths){
				const row = new BoxRenderable(render,{
					height:1,
					onMouseOver(e:MouseEvent){
						fn(key as string);
						render.requestRender();
					},
					onMouseOut(e:MouseEvent){
						fn(null);
						render.requestRender();
					}
				});
				row.add(new TextRenderable(render, { content: path }))
				list.add(row);
			}
			return list;
		};

		contentBox.add(hover());
		sideBarBox.add(contentBox);

		return sideBarBox
};








