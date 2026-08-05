import { apiFetch } from "../../utils/apiFetch.ts";
import type { LOG, LOG_API, LOG_DETAILS } from "../../types/log.types.ts";

export function LOG():LOG_API{
	const create = async(details: LOG_DETAILS["name"], userId:string):Promise<{details:LOG_DETAILS, log:LOG} | any> => {
		const res = await apiFetch(`${process.env.SERVER}/api/log/create`,"POST", { details, userId });
		return res;
	};
	const remove = async(name: LOG_DETAILS["name"], userId:string):Promise<any | { ok:boolean }> => {
		const res = await apiFetch(`${process.env.SERVER}/api/log/remove`, "DELETE", { name, userId });	
		return res;
	}; 
	const join = async(name: LOG_DETAILS, userId:string):Promise<{details:LOG_DETAILS, log:LOG} | any> => {
		const res = await apiFetch(`${process.env.server}/api/log/join`, "POST", { name, userId });		
		return res;
	};
	const leave = async(name: LOG_DETAILS["name"]):Promise<any | { ok:boolean }> => {
		const res = await apiFetch(`${process.env.server}/api/log/leave`, "POST", { name });		
		return res;
	};
	return { create, remove, join, leave}
}
