import { AUTH_ROUTES } from "./auth/auth.routes";


const server = Bun.serve({
	port: Number(process.env.PORT),
	hostname: process.env.SERVER_HOST as string,
	development:{
		console:true
	},
	routes:{
		...AUTH_ROUTES,
	}
});

console.log(server)

