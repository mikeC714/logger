import { AuthService } from "./auth.service.ts";
import { AuthControllers } from "./auth.controllers.ts";
import { db, test_db } from "../config/sqlite.config.ts";  

const authService = new AuthService(db);
const auth = new AuthControllers(authService);

export const AUTH_ROUTES = {
	"/api/auth/signup":{
		POST:auth.signup
	},
	"/api/auth/login":{
		POST: auth.login 
	}
}; 
