import { AuthController } from "./auth.controllers.ts";

export const AuthRoutes = {
	"api/auth/signup":{
		POST: AuthController.signup,
	},
	"api/auth/login":{
		POST: AuthController.login,
	}
};

