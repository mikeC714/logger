import { BoxRenderable, TextRenderable, t, bold, Box } from "@opentui/core";
import type { MouseEvent } from "@opentui/core";


type SEARCH_RESULTS = Array<Record<string, {
	projectKey:string;
	path:string;
}>>


export function SideBar(main:any, paths:ReadonlyMap<string, string>, searchResults: SEARCH_RESULTS | null, fn:(path:string | null) => void){
		const sideBarBox = new BoxRenderable(main, {
			id:"sideBar",
			flexDirection:"column"
		});
		const contentBox = new BoxRenderable(main,{
			id:"contentBox"
		});

		if(searchResults !== null){
			searchResults.map((c:any) => {
				const logName = new TextRenderable(main, { id:"logName" });
				logName.content = c.logName;
				contentBox.add(logName);
			});
		}else{
			for(const [key, _] of paths){
				const logName = new TextRenderable(main, { id:"logName" });
				logName.content = key;
				contentBox.add(logName);
			}
		};

		function hover(){
			const list = new BoxRenderable(main, { flexDirection:"column" });

			for(const [key, path] of paths){
				const row = new BoxRenderable(main,{
					height:1,
					onMouseOver(e:MouseEvent){
						fn(key as string);
						main.requestRender();
					},
					onMouseOut(e:MouseEvent){
						fn(null);
						main.requestRender();
					}
				});
				row.add(new TextRenderable(main, { content: path }))
				list.add(row);
			}
			return list;
		};

		contentBox.add(hover());
		sideBarBox.add(contentBox);

		return sideBarBox
};








