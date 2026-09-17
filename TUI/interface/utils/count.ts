export class Count{
	private state:{ count:number };
	constructor(state:{ count:number } = { count: 0 }){
		this.state = state;
	}
	get = () => {
		return this.state;
	};
	updateState = (state: ((prev:{count:number}) => { count:number })) => {
		const update = typeof state === "function" ? state(this.state) : state;
		return this.state = Object.assign({}, this.state, update); 
	}
	set = (value:number) => {
		this.updateState((prev) => ({ count: prev.count + value }))
	};
};
