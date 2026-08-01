import { routes } from "./routes/routes.ts";
import { AuthError } from "./error/auth.err.ts";
import { AppError } from "./error/app.err.ts";

const app = Bun.serve({
	port:process.env.PORT,
	routes,
	error(error) {
		let status = 500;
		let ok = false;
		if(error instanceof AuthError){
			return Response.json({
				ok,
				message: error.message,
				code: error.code
			},{ status })			
		}else if(error instanceof AppError){
			return Response.json({
				ok,
				message: error.message,
				code: error.code
			},{ status })			
		}
		return Response.json({
			ok, 
			message: "Server Error",
			code: error.message	
		},{ status })
	},
})
